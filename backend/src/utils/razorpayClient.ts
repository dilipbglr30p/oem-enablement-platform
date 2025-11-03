import Razorpay from 'razorpay';
import { config } from '../config/env';
import logger from './logger';

// Initialize Razorpay client
export const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Payment interfaces
export interface CreatePaymentOrderData {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create payment order
export const createPaymentOrder = async (data: CreatePaymentOrderData) => {
  try {
    const options = {
      amount: data.amount * 100, // Convert to paise
      currency: data.currency || 'INR',
      receipt: data.receipt,
      notes: data.notes || {},
    };

    const order = await razorpay.orders.create(options);
    
    logger.info(`Payment order created: ${order.id}`);
    
    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        created_at: order.created_at,
      },
    };
  } catch (error) {
    logger.error('Error creating payment order:', error);
    return {
      success: false,
      error: 'Failed to create payment order',
    };
  }
};

// Verify payment signature
export const verifyPayment = (data: PaymentVerificationData) => {
  try {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', config.razorpay.keySecret);
    
    hmac.update(data.razorpay_order_id + '|' + data.razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');
    
    const isValid = generatedSignature === data.razorpay_signature;
    
    if (isValid) {
      logger.info(`Payment verified successfully: ${data.razorpay_payment_id}`);
      return {
        success: true,
        verified: true,
      };
    } else {
      logger.warn(`Payment verification failed: ${data.razorpay_payment_id}`);
      return {
        success: false,
        verified: false,
        error: 'Invalid payment signature',
      };
    }
  } catch (error) {
    logger.error('Error verifying payment:', error);
    return {
      success: false,
      verified: false,
      error: 'Payment verification failed',
    };
  }
};

// Get payment details
export const getPaymentDetails = async (paymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at,
        captured: payment.captured,
        description: payment.description,
      },
    };
  } catch (error) {
    logger.error('Error fetching payment details:', error);
    return {
      success: false,
      error: 'Failed to fetch payment details',
    };
  }
};

// Refund payment
export const refundPayment = async (paymentId: string, amount?: number) => {
  try {
    const refundData: any = {
      payment_id: paymentId,
    };
    
    if (amount) {
      refundData.amount = amount * 100; // Convert to paise
    }
    
    const refund = await razorpay.payments.refund(paymentId, refundData);
    
    logger.info(`Payment refunded: ${refund.id}`);
    
    return {
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        created_at: refund.created_at,
      },
    };
  } catch (error) {
    logger.error('Error processing refund:', error);
    return {
      success: false,
      error: 'Failed to process refund',
    };
  }
};
