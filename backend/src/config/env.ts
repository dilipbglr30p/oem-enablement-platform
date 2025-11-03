import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  
  // Supabase
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
  
  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  
  // Razorpay
  RAZORPAY_KEY_ID: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
  
  // Twilio
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_WHATSAPP_NUMBER: Joi.string().default('whatsapp:+14155238886'),
  
  // Sentry
  SENTRY_DSN: Joi.string().optional(),
  
  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:8080'),
  FRONTEND_URL: Joi.string().default('http://localhost:8080'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
  
  // Redis Cache
  UPSTASH_REDIS_URL: Joi.string().optional(),
  UPSTASH_REDIS_TOKEN: Joi.string().optional(),
  
  // App Version
  APP_VERSION: Joi.string().default('2.0.0'),
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration
export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  
  supabase: {
    url: envVars.SUPABASE_URL,
    anonKey: envVars.SUPABASE_ANON_KEY,
    serviceRoleKey: envVars.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  
  razorpay: {
    keyId: envVars.RAZORPAY_KEY_ID,
    keySecret: envVars.RAZORPAY_KEY_SECRET,
  },
  
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    whatsappNumber: envVars.TWILIO_WHATSAPP_NUMBER,
  },
  
  sentry: {
    dsn: envVars.SENTRY_DSN,
  },
  
  cors: {
    origin: envVars.CORS_ORIGIN,
  },
  
  frontend: {
    url: envVars.FRONTEND_URL,
  },
  
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
  },
  
  redis: {
    url: envVars.UPSTASH_REDIS_URL,
    token: envVars.UPSTASH_REDIS_TOKEN,
  },
  
  app: {
    version: envVars.APP_VERSION,
  },
};
