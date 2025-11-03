import { Request, Response, NextFunction } from 'express';
import { supabase, TABLES, handleSupabaseError } from '../utils/supabaseClient';
import { sendComplianceAlert } from '../utils/whatsappClient';
import { AppError, asyncHandler } from '../utils/errorHandler';
import logger from '../observability/logger';
// import { cacheGet, cacheSet, cacheInvalidate } from '../utils/redisClient';

// Create new compliance item
export const createCompliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, type, description, due_date, priority, status, documents } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const complianceData = {
    user_id: userId,
    title,
    type,
    description: description || null,
    due_date,
    priority: priority || 'medium',
    status: status || 'pending',
    documents: documents || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(TABLES.COMPLIANCE)
    .insert([complianceData])
    .select()
    .single();

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  logger.info(`Compliance item created: ${data.id} by user: ${userId}`);

  // Cache invalidation would go here when Redis is fully implemented

  // Send alert for high priority items
  if (priority === 'high' || priority === 'critical') {
    // This would typically get phone number from user profile
    // await sendComplianceAlert(phoneNumber, data);
  }

  res.status(201).json({
    success: true,
    message: 'Compliance item created successfully',
    data,
  });
});

// Get all compliance items for authenticated user
export const getCompliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { type, status, priority, page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Caching would be implemented here when Redis is fully set up

  let query = supabase
    .from(TABLES.COMPLIANCE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Apply filters
  if (type) query = query.eq('type', type);
  if (status) query = query.eq('status', status);
  if (priority) query = query.eq('priority', priority);

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
      compliance: data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    },
  });
});

// Get single compliance item by ID
export const getComplianceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data, error } = await supabase
    .from(TABLES.COMPLIANCE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Compliance item not found', 404);
    }
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  res.json({
    success: true,
    data,
  });
});

// Update compliance item
export const updateCompliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, priority, description, due_date, documents } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Check if compliance item exists and belongs to user
  const { data: existingItem, error: fetchError } = await supabase
    .from(TABLES.COMPLIANCE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new AppError('Compliance item not found', 404);
    }
    const errorInfo = handleSupabaseError(fetchError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (description !== undefined) updateData.description = description;
  if (due_date !== undefined) updateData.due_date = due_date;
  if (documents !== undefined) updateData.documents = documents;

  const { data, error } = await supabase
    .from(TABLES.COMPLIANCE)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  logger.info(`Compliance item updated: ${id} by user: ${userId}`);

  // Cache invalidation would go here when Redis is fully implemented

  res.json({
    success: true,
    message: 'Compliance item updated successfully',
    data,
  });
});

// Delete compliance item
export const deleteCompliance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  // Check if compliance item exists and belongs to user
  const { data: existingItem, error: fetchError } = await supabase
    .from(TABLES.COMPLIANCE)
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new AppError('Compliance item not found', 404);
    }
    const errorInfo = handleSupabaseError(fetchError);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  const { error } = await supabase
    .from(TABLES.COMPLIANCE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  logger.info(`Compliance item deleted: ${id} by user: ${userId}`);

  // Cache invalidation would go here when Redis is fully implemented

  res.json({
    success: true,
    message: 'Compliance item deleted successfully',
  });
});

// Get compliance statistics
export const getComplianceStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const { data, error } = await supabase
    .from(TABLES.COMPLIANCE)
    .select('type, status, priority, due_date, created_at')
    .eq('user_id', userId);

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  // Calculate statistics
  const now = new Date();
  const stats = {
    total: data.length,
    pending: data.filter(item => item.status === 'pending').length,
    in_progress: data.filter(item => item.status === 'in_progress').length,
    completed: data.filter(item => item.status === 'completed').length,
    overdue: data.filter(item => {
      if (item.status === 'completed') return false;
      return new Date(item.due_date) < now;
    }).length,
    by_type: {
      certification: data.filter(item => item.type === 'certification').length,
      audit: data.filter(item => item.type === 'audit').length,
      report: data.filter(item => item.type === 'report').length,
      alert: data.filter(item => item.type === 'alert').length,
    },
    by_priority: {
      low: data.filter(item => item.priority === 'low').length,
      medium: data.filter(item => item.priority === 'medium').length,
      high: data.filter(item => item.priority === 'high').length,
      critical: data.filter(item => item.priority === 'critical').length,
    },
    this_month: data.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }).length,
  };

  res.json({
    success: true,
    data: stats,
  });
});

// Get upcoming compliance deadlines
export const getUpcomingDeadlines = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const { days = 30 } = req.query;

  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Number(days));

  const { data, error } = await supabase
    .from(TABLES.COMPLIANCE)
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'completed')
    .lte('due_date', futureDate.toISOString())
    .order('due_date', { ascending: true });

  if (error) {
    const errorInfo = handleSupabaseError(error);
    throw new AppError(errorInfo.message, errorInfo.status);
  }

  res.json({
    success: true,
    data: {
      upcoming: data,
      count: data.length,
    },
  });
});
