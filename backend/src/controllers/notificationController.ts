import { Request, Response, NextFunction } from 'express';
import { supabase, TABLES, handleSupabaseError } from '../utils/supabaseClient';
import { 
  sendWhatsAppMessage, 
  sendOrderConfirmation, 
  sendOrderStatusUpdate, 
  sendComplianceAlert,
  sendPaymentConfirmation 
} from '../utils/whatsappClient';
import { AppError, asyncHandler } from '../utils/errorHandler';
import logger from '../utils/logger';

// Send WhatsApp message
export const sendWhatsApp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number, message, order_id } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Validate phone number format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone_number)) {
    throw new AppError('Invalid phone number format', 400);
  }

  const result = await sendWhatsAppMessage({
    to: phone_number,
    message,
  });

  if (!result.success) {
    throw new AppError(result.error || 'Failed to send WhatsApp message', 500);
  }

  // Log notification in database
  const notificationData = {
    user_id: userId,
    type: 'whatsapp',
    recipient: phone_number,
    message,
    order_id: order_id || null,
    status: 'sent',
    created_at: new Date().toISOString(),
  };

  const { error: logError } = await supabase
    .from(TABLES.NOTIFICATIONS)
    .insert([notificationData]);

  if (logError) {
    logger.error('Failed to log notification:', logError);
  }

  logger.info(`WhatsApp message sent to ${phone_number} by user: ${userId}`);

  res.json({
    success: true,
    message: 'WhatsApp message sent successfully',
    data: {
      messageId: result.messageId,
      status: result.status,
    },
  });
});

// Send order confirmation notification
export const sendOrderConfirmationNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order_id, phone_number } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from(TABLES.ORDERS)
    .select('*')
    .eq('id', order_id)
    .eq('user_id', userId)
    .single();

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      throw new AppError('Order not found', 404);
    }
    const errorInfo = handleSupabaseError(orderError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  const result = await sendOrderConfirmation(phone_number, order);

  if (!result.success) {
    throw new AppError(result.error || 'Failed to send order confirmation', 500);
  }

  // Log notification
  const notificationData = {
    user_id: userId,
    type: 'order_confirmation',
    recipient: phone_number,
    message: `Order confirmation for ${order_id}`,
    order_id,
    status: 'sent',
    created_at: new Date().toISOString(),
  };

  await supabase
    .from(TABLES.NOTIFICATIONS)
    .insert([notificationData]);

  logger.info(`Order confirmation sent for ${order_id} to ${phone_number}`);

  res.json({
    success: true,
    message: 'Order confirmation sent successfully',
    data: {
      messageId: result.messageId,
      status: result.status,
    },
  });
});

// Send order status update notification
export const sendOrderStatusUpdateNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { order_id, phone_number } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from(TABLES.ORDERS)
    .select('*')
    .eq('id', order_id)
    .eq('user_id', userId)
    .single();

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      throw new AppError('Order not found', 404);
    }
    const errorInfo = handleSupabaseError(orderError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  const result = await sendOrderStatusUpdate(phone_number, order);

  if (!result.success) {
    throw new AppError(result.error || 'Failed to send status update', 500);
  }

  // Log notification
  const notificationData = {
    user_id: userId,
    type: 'status_update',
    recipient: phone_number,
    message: `Status update for ${order_id}`,
    order_id,
    status: 'sent',
    created_at: new Date().toISOString(),
  };

  await supabase
    .from(TABLES.NOTIFICATIONS)
    .insert([notificationData]);

  logger.info(`Status update sent for ${order_id} to ${phone_number}`);

  res.json({
    success: true,
    message: 'Status update sent successfully',
    data: {
      messageId: result.messageId,
      status: result.status,
    },
  });
});

// Send compliance alert notification
export const sendComplianceAlertNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { compliance_id, phone_number } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Get compliance details
  const { data: compliance, error: complianceError } = await supabase
    .from(TABLES.COMPLIANCE)
    .select('*')
    .eq('id', compliance_id)
    .eq('user_id', userId)
    .single();

  if (complianceError) {
    if (complianceError.code === 'PGRST116') {
      throw new AppError('Compliance item not found', 404);
    }
    const errorInfo = handleSupabaseError(complianceError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  const result = await sendComplianceAlert(phone_number, compliance);

  if (!result.success) {
    throw new AppError(result.error || 'Failed to send compliance alert', 500);
  }

  // Log notification
  const notificationData = {
    user_id: userId,
    type: 'compliance_alert',
    recipient: phone_number,
    message: `Compliance alert for ${compliance.title}`,
    compliance_id,
    status: 'sent',
    created_at: new Date().toISOString(),
  };

  await supabase
    .from(TABLES.NOTIFICATIONS)
    .insert([notificationData]);

  logger.info(`Compliance alert sent for ${compliance_id} to ${phone_number}`);

  res.json({
    success: true,
    message: 'Compliance alert sent successfully',
    data: {
      messageId: result.messageId,
      status: result.status,
    },
  });
});

// Get notification history
export const getNotifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { type, page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  let query = supabase
    .from(TABLES.NOTIFICATIONS)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Filter by type if provided
  if (type) {
    query = query.eq('type', type);
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
      notifications: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    },
  });
});

// Get notification statistics
export const getNotificationStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data, error } = await supabase
    .from(TABLES.NOTIFICATIONS)
    .select('type, status, created_at')
    .eq('user_id', userId);

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  // Calculate statistics
  const now = new Date();
  const stats = {
    total: data.length,
    sent: data.filter(notif => notif.status === 'sent').length,
    failed: data.filter(notif => notif.status === 'failed').length,
    by_type: {
      whatsapp: data.filter(notif => notif.type === 'whatsapp').length,
      order_confirmation: data.filter(notif => notif.type === 'order_confirmation').length,
      status_update: data.filter(notif => notif.type === 'status_update').length,
      compliance_alert: data.filter(notif => notif.type === 'compliance_alert').length,
    },
    this_month: data.filter(notif => {
      const notifDate = new Date(notif.created_at);
      return notifDate.getMonth() === now.getMonth() && notifDate.getFullYear() === now.getFullYear();
    }).length,
  };

  res.json({
    success: true,
    data: stats,
  });
});
