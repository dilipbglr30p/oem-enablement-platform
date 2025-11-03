import { Request, Response, NextFunction } from 'express';
import { supabase, TABLES, handleSupabaseError } from '../utils/supabaseClient';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '../utils/whatsappClient';
import { AppError, asyncHandler } from '../utils/errorHandler';
import logger from '../observability/logger';
// import { cacheGet, cacheSet, cacheInvalidate } from '../utils/redisClient';

// Create new order
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { client, product, quantity, specifications, delivery_date, notes } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Generate order ID
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const orderData = {
    id: orderId,
    user_id: userId,
    client,
    product,
    quantity,
    specifications: specifications || {},
    delivery_date: delivery_date || null,
    notes: notes || null,
    status: 'pending',
    progress: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .insert([orderData])
    .select()
    .single();

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  logger.info(`Order created: ${orderId} by user: ${userId}`);

  // Cache invalidation would go here when Redis is fully implemented

  // Send WhatsApp confirmation (if phone number available)
  // This would typically come from user profile or order data
  // await sendOrderConfirmation(phoneNumber, data);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data,
  });
});

// Get all orders for authenticated user
export const getOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { status, page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Caching would be implemented here when Redis is fully set up

  let query = supabase
    .from(TABLES.ORDERS)
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
      orders: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    },
  });
});

// Get single order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Order not found', 404);
    }
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  res.json({
    success: true,
    data,
  });
});

// Update order
export const updateOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, progress, notes, delivery_date } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Check if order exists and belongs to user
  const { data: existingOrder, error: fetchError } = await supabase
    .from(TABLES.ORDERS)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new AppError('Order not found', 404);
    }
    const errorInfo = handleSupabaseError(fetchError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (status !== undefined) updateData.status = status;
  if (progress !== undefined) updateData.progress = progress;
  if (notes !== undefined) updateData.notes = notes;
  if (delivery_date !== undefined) updateData.delivery_date = delivery_date;

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  logger.info(`Order updated: ${id} by user: ${userId}`);

  // Cache invalidation would go here when Redis is fully implemented

  // Send status update notification if status changed
  if (status && status !== existingOrder.status) {
    // This would typically get phone number from user profile
    // await sendOrderStatusUpdate(phoneNumber, data);
  }

  res.json({
    success: true,
    message: 'Order updated successfully',
    data,
  });
});

// Delete order
export const deleteOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Check if order exists and belongs to user
  const { data: existingOrder, error: fetchError } = await supabase
    .from(TABLES.ORDERS)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new AppError('Order not found', 404);
    }
    const errorInfo = handleSupabaseError(fetchError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  // Only allow deletion of pending orders
  if (existingOrder.status !== 'pending') {
    throw new AppError('Only pending orders can be deleted', 400);
  }

  const { error } = await supabase
    .from(TABLES.ORDERS)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  logger.info(`Order deleted: ${id} by user: ${userId}`);

  // Cache invalidation would go here when Redis is fully implemented

  res.json({
    success: true,
    message: 'Order deleted successfully',
  });
});

// Get order statistics
export const getOrderStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select('status, quantity, created_at')
    .eq('user_id', userId);

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  // Calculate statistics
  const stats = {
    total: data.length,
    pending: data.filter(order => order.status === 'pending').length,
    in_production: data.filter(order => order.status === 'in_production').length,
    quality_check: data.filter(order => order.status === 'quality_check').length,
    completed: data.filter(order => order.status === 'completed').length,
    cancelled: data.filter(order => order.status === 'cancelled').length,
    total_quantity: data.reduce((sum, order) => sum + order.quantity, 0),
    this_month: data.filter(order => {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }).length,
  };

  res.json({
    success: true,
    data: stats,
  });
});
