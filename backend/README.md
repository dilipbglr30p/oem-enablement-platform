# Textile OEM Platform - Backend API

A comprehensive Express.js backend API for the Textile OEM Platform, built with TypeScript and integrated with Supabase, Razorpay, and Twilio.

## 🚀 Features

- **Authentication**: JWT-based authentication with Supabase integration
- **Order Management**: Complete CRUD operations for manufacturing orders
- **Compliance Tracking**: Manage certifications, audits, and compliance deadlines
- **Payment Processing**: Razorpay integration for payment handling
- **Notifications**: WhatsApp notifications via Twilio
- **Health Monitoring**: Comprehensive health checks and metrics
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Winston logger with Sentry error tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **Payments**: Razorpay
- **Notifications**: Twilio WhatsApp API
- **Monitoring**: Sentry
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: Joi

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── controllers/
│   │   ├── ordersController.ts
│   │   ├── complianceController.ts
│   │   ├── notificationController.ts
│   │   ├── paymentController.ts
│   │   └── healthController.ts
│   ├── middlewares/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── validation.ts       # Input validation
│   │   └── rateLimiter.ts      # Rate limiting
│   ├── routes/
│   │   ├── orders.ts
│   │   ├── compliance.ts
│   │   ├── notify.ts
│   │   ├── payments.ts
│   │   └── health.ts
│   ├── utils/
│   │   ├── supabaseClient.ts   # Supabase configuration
│   │   ├── logger.ts           # Winston logger
│   │   ├── errorHandler.ts     # Error handling
│   │   ├── razorpayClient.ts   # Razorpay integration
│   │   └── whatsappClient.ts   # Twilio WhatsApp
│   └── index.ts                # Main application
├── .env.example                # Environment variables template
├── package.json
├── tsconfig.json
├── railway.json               # Railway deployment config
└── README.md
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Sentry Configuration
SENTRY_DSN=your_sentry_dsn

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Endpoints

### Authentication
All endpoints (except health checks) require a Bearer token in the Authorization header.

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (with pagination)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/stats` - Get order statistics

### Compliance
- `POST /api/compliance` - Create compliance item
- `GET /api/compliance` - Get all compliance items
- `GET /api/compliance/:id` - Get compliance item by ID
- `PATCH /api/compliance/:id` - Update compliance item
- `DELETE /api/compliance/:id` - Delete compliance item
- `GET /api/compliance/stats` - Get compliance statistics
- `GET /api/compliance/upcoming` - Get upcoming deadlines

### Notifications
- `POST /api/notify/whatsapp` - Send WhatsApp message
- `POST /api/notify/order-confirmation` - Send order confirmation
- `POST /api/notify/order-status-update` - Send status update
- `POST /api/notify/compliance-alert` - Send compliance alert
- `GET /api/notify` - Get notification history
- `GET /api/notify/stats` - Get notification statistics

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/webhook` - Razorpay webhook
- `GET /api/payments` - Get payment history
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/stats` - Get payment statistics

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check (requires auth)
- `GET /api/health/metrics` - System metrics (requires auth)

## 🚀 Deployment

### Railway Deployment

1. **Connect to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Set environment variables**
   ```bash
   railway variables set SUPABASE_URL=your_url
   railway variables set JWT_SECRET=your_secret
   # ... set all required variables
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure token-based auth
- **Error Handling**: Centralized error management

## 📊 Monitoring

- **Health Checks**: Basic and detailed health endpoints
- **Logging**: Winston logger with multiple transports
- **Error Tracking**: Sentry integration
- **Metrics**: System performance metrics

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 API Documentation

Visit `http://localhost:3000/api` for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@textileoem.com or create an issue in the repository.
