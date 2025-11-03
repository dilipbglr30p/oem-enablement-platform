import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

// Create Supabase client with service role key for backend operations
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create Supabase client with anon key for user operations
export const supabaseAnon = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Database table names
export const TABLES = {
  USERS: 'users',
  ORDERS: 'orders',
  COMPLIANCE: 'compliance',
  PAYMENTS: 'payments',
  NOTIFICATIONS: 'notifications',
} as const;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique constraint violation
        return { message: 'Resource already exists', status: 409 };
      case '23503': // Foreign key constraint violation
        return { message: 'Referenced resource not found', status: 400 };
      case '23502': // Not null constraint violation
        return { message: 'Required field is missing', status: 400 };
      default:
        return { message: 'Database operation failed', status: 500 };
    }
  }
  
  return { message: 'Database operation failed', status: 500 };
};
