import { Request, Response, NextFunction } from 'express';
import { supabase, TABLES, handleSupabaseError } from '../utils/supabaseClient';
import { createPaymentOrder, verifyPayment, getPaymentDetails, refundPayment } from '../utils/razorpayClient';
import { sendPaymentConfirmation } from '../utils/whatsappClient';
import { AppError, asyncHandler } from '../utils/errorHandler';
import logger from '../utils/logger';

// Create payment order
export const createPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency, order_id, notes } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Generate receipt ID
  const receiptId = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const paymentData = {
    amount,
    currency: currency || 'INR',
    receipt: receiptId,
    notes: {
      order_id: order_id || '',
      user_id: userId,
      ...notes,
    },
  };

  const result = await createPaymentOrder(paymentData);

  if (!result.success || !result.order) {
    throw new AppError(result.error || 'Failed to create payment order', 500);
  }

  // Store payment order in database
  const paymentOrderData = {
    id: result.order.id,
    user_id: userId,
    order_id: order_id || null,
    amount: result.order.amount,
    currency: result.order.currency,
    receipt: result.order.receipt,
    status: 'created',
    razorpay_order_id: result.order.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: paymentRecord, error: dbError } = await supabase
    .from(TABLES.PAYMENTS)
    .insert([paymentOrderData])
    .select()
    .single();

  if (dbError) {
    logger.error('Failed to store payment order:', dbError);
    // Don't throw error here as payment order was created successfully
  }

  logger.info(`Payment order created: ${result.order.id} for user: ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Payment order created successfully',
    data: {
      order: result.order,
      payment_record: paymentRecord,
    },
  });
});

// Verify payment
export const verifyPaymentWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError('Missing payment verification data', 400);
  }

  // Verify payment signature
  const verificationResult = verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!verificationResult.success || !verificationResult.verified) {
    throw new AppError(verificationResult.error || 'Payment verification failed', 400);
  }

  // Get payment details from Razorpay
  const paymentDetails = await getPaymentDetails(razorpay_payment_id);

  if (!paymentDetails.success || !paymentDetails.payment) {
    throw new AppError(paymentDetails.error || 'Failed to fetch payment details', 500);
  }

  // Update payment record in database
  const { data: paymentRecord, error: fetchError } = await supabase
    .from(TABLES.PAYMENTS)
    .select('*')
    .eq('razorpay_order_id', razorpay_order_id)
    .single();

  if (fetchError) {
    logger.error('Payment record not found:', fetchError);
    throw new AppError('Payment record not found', 404);
  }

  const { data: updatedPayment, error: updateError } = await supabase
    .from(TABLES.PAYMENTS)
    .update({
      razorpay_payment_id,
      status: paymentDetails.payment.status,
      payment_method: paymentDetails.payment.method,
      captured: paymentDetails.payment.captured,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentRecord.id)
    .select()
    .single();

  if (updateError) {
    logger.error('Failed to update payment record:', updateError);
    throw new AppError('Failed to update payment record', 500);
  }

  // Send payment confirmation notification
  if (paymentDetails.payment.status === 'captured') {
    // This would typically get phone number from user profile
    // await sendPaymentConfirmation(phoneNumber, paymentDetails.payment);
  }

  logger.info(`Payment verified successfully: ${razorpay_payment_id}`);

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      payment: paymentDetails.payment,
      payment_record: updatedPayment,
    },
  });
});

// Get payment details
export const getPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data: payment, error } = await supabase
    .from(TABLES.PAYMENTS)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Payment not found', 404);
    }
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  res.json({
    success: true,
    data: payment,
  });
});

// Get all payments for user
export const getPayments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { status, page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  let query = supabase
    .from(TABLES.PAYMENTS)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Filter by status if provided
  if (status) {
    query = query.eq('status', status);
  }

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);
  query = query.range(offset, offset + Number(limit) - 1);

  const { data, error, count } = await query;

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  res.json({
    success: true,
    data: {
      payments: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    },
  });
});

// Process refund
export const processRefund = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { payment_id, amount } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Get payment record
  const { data: payment, error: fetchError } = await supabase
    .from(TABLES.PAYMENTS)
    .select('*')
    .eq('razorpay_payment_id', payment_id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new AppError('Payment not found', 404);
    }
    const errorInfo = handleSupabaseError(fetchError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  if (payment.status !== 'captured') {
    throw new AppError('Only captured payments can be refunded', 400);
  }

  // Process refund with Razorpay
  const refundResult = await refundPayment(payment_id, amount);

  if (!refundResult.success || !refundResult.refund) {
    throw new AppError(refundResult.error || 'Failed to process refund', 500);
  }

  // Update payment record
  const { error: updateError } = await supabase
    .from(TABLES.PAYMENTS)
    .update({
      status: 'refunded',
      refund_id: refundResult.refund.id,
      refund_amount: refundResult.refund.amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  if (updateError) {
    logger.error('Failed to update payment record after refund:', updateError);
  }

  logger.info(`Refund processed for payment: ${payment_id}`);

  res.json({
    success: true,
    message: 'Refund processed successfully',
    data: {
      refund: refundResult.refund,
    },
  });
});

// Get payment statistics
export const getPaymentStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data, error } = await supabase
    .from(TABLES.PAYMENTS)
    .select('amount, currency, status, created_at')
    .eq('user_id', userId);

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  // Calculate statistics
  const now = new Date();
  const stats = {
    total: data.length,
    total_amount: data.reduce((sum, payment) => sum + payment.amount, 0),
    captured: data.filter(payment => payment.status === 'captured').length,
    failed: data.filter(payment => payment.status === 'failed').length,
    refunded: data.filter(payment => payment.status === 'refunded').length,
    this_month: data.filter(payment => {
      const paymentDate = new Date(payment.created_at);
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    }).length,
    this_month_amount: data
      .filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, payment) => sum + payment.amount, 0),
  };

  res.json({
    success: true,
    data: stats,
  });
});
