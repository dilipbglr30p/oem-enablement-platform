import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/errorHandler';

// Generic validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    next();
  };
};

// Validation schemas
export const orderSchemas = {
  create: Joi.object({
    client: Joi.string().required(),
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    specifications: Joi.object().optional(),
    delivery_date: Joi.date().iso().optional(),
    notes: Joi.string().optional(),
  }),
  
  update: Joi.object({
    status: Joi.string().valid('pending', 'in_production', 'quality_check', 'completed', 'cancelled').optional(),
    progress: Joi.number().min(0).max(100).optional(),
    notes: Joi.string().optional(),
    delivery_date: Joi.date().iso().optional(),
  }),
};

export const complianceSchemas = {
  create: Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('certification', 'audit', 'report', 'alert').required(),
    description: Joi.string().optional(),
    due_date: Joi.date().iso().required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue').default('pending'),
    documents: Joi.array().items(Joi.string()).optional(),
  }),
  
  update: Joi.object({
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'overdue').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    description: Joi.string().optional(),
    due_date: Joi.date().iso().optional(),
    documents: Joi.array().items(Joi.string()).optional(),
  }),
};

export const notificationSchemas = {
  whatsapp: Joi.object({
    phone_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    message: Joi.string().required(),
    order_id: Joi.string().optional(),
  }),
  
  email: Joi.object({
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
    order_id: Joi.string().optional(),
  }),
};

export const paymentSchemas = {
  createOrder: Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().valid('INR', 'USD', 'EUR').default('INR'),
    order_id: Joi.string().required(),
    notes: Joi.object().optional(),
  }),
  
  verify: Joi.object({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
  }),
};

export const userSchemas = {
  update: Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    company: Joi.string().optional(),
    role: Joi.string().valid('admin', 'manager', 'user').optional(),
  }),
};
