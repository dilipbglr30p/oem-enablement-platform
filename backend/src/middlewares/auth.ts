import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { supabase } from '../utils/supabaseClient';
import { AppError } from '../utils/errorHandler';
import logger from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// JWT payload interface
interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Verify JWT token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', decoded.sub)
      .single();

    if (error || !user) {
      throw new AppError('User not found', 401);
    }

    if (!user.is_active) {
      throw new AppError('Account is deactivated', 401);
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

// Check if user has required role
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', decoded.sub)
      .single();

    if (!error && user && user.is_active) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Generate JWT token
export const generateToken = (payload: { sub: string; email: string; role: string }) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Verify Supabase JWT token (for frontend auth)
export const verifySupabaseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Invalid token', 401);
    }

    // Get user details from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role, is_active')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      throw new AppError('User not found', 401);
    }

    if (!userData.is_active) {
      throw new AppError('Account is deactivated', 401);
    }

    req.user = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
