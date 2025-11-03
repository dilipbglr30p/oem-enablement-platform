import request from 'supertest';
import express from 'express';
import ordersRoutes from '../../src/routes/orders';
import { verifyToken } from '../../src/middlewares/auth';

// Mock auth middleware
jest.mock('../../src/middlewares/auth', () => ({
  verifyToken: jest.fn((req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id' };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/orders', ordersRoutes);

describe('Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orders', () => {
    it('should return orders with pagination', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('orders');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should filter orders by status', async () => {
      const response = await request(app)
        .get('/api/orders?status=pending')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/orders?page=1&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 5);
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        client: 'Test Client',
        product: 'Test Product',
        quantity: 100,
        specifications: { color: 'blue' },
        delivery_date: '2024-12-31',
        notes: 'Test order',
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Order created successfully');
      expect(response.body).toHaveProperty('data');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return a specific order', async () => {
      const response = await request(app)
        .get('/api/orders/test-order-id')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('PATCH /api/orders/:id', () => {
    it('should update an order', async () => {
      const updateData = {
        status: 'in_production',
        progress: 50,
        notes: 'Updated notes',
      };

      const response = await request(app)
        .patch('/api/orders/test-order-id')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Order updated successfully');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete an order', async () => {
      const response = await request(app)
        .delete('/api/orders/test-order-id')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Order deleted successfully');
    });
  });

  describe('GET /api/orders/stats', () => {
    it('should return order statistics', async () => {
      const response = await request(app)
        .get('/api/orders/stats')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('pending');
      expect(response.body.data).toHaveProperty('completed');
    });
  });
});
