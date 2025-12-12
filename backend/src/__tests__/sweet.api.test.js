import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Sweet from '../models/Sweet.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

describe('Sweet API Endpoints', () => {
  let userToken;
  let adminToken;
  let userId;
  let adminId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test');

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });
    userId = user._id;
    userToken = generateToken(user._id);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminId = admin._id;
    adminToken = generateToken(admin._id);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet with admin token', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100,
        description: 'Delicious milk chocolate'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.sweet).toHaveProperty('_id');
      expect(response.body.sweet.name).toBe(sweetData.name);
      expect(response.body.sweet.category).toBe(sweetData.category);
      expect(response.body.sweet.price).toBe(sweetData.price);
      expect(response.body.sweet.quantity).toBe(sweetData.quantity);
    });

    it('should fail to create sweet without authentication', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);
    });

    it('should fail to create sweet with user role (not admin)', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Chocolate Bar', category: 'Chocolate', price: 2.99, quantity: 100 },
        { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 50 },
        { name: 'Lollipop', category: 'Lollipop', price: 0.99, quantity: 200 }
      ]);
    });

    it('should get all sweets without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.sweets).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it('should get all sweets with user authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(3);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        { name: 'Milk Chocolate', category: 'Chocolate', price: 2.99, quantity: 100 },
        { name: 'Dark Chocolate', category: 'Chocolate', price: 3.99, quantity: 50 },
        { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 75 },
        { name: 'Lollipop', category: 'Lollipop', price: 0.99, quantity: 200 }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .expect(200);

      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.sweets[0].name).toMatch(/Chocolate/i);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Gummy')
        .expect(200);

      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].category).toBe('Gummy');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=4')
        .expect(200);

      expect(response.body.sweets.length).toBeGreaterThan(0);
      response.body.sweets.forEach(sweet => {
        expect(sweet.price).toBeGreaterThanOrEqual(2);
        expect(sweet.price).toBeLessThanOrEqual(4);
      });
    });

    it('should return empty array when no matches found', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=nonexistent')
        .expect(200);

      expect(response.body.sweets).toHaveLength(0);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should update sweet with admin token', async () => {
      const updateData = {
        name: 'Updated Chocolate',
        price: 3.99
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.sweet.name).toBe(updateData.name);
      expect(response.body.sweet.price).toBe(updateData.price);
    });

    it('should fail to update sweet without authentication', async () => {
      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ name: 'Updated' })
        .expect(401);
    });

    it('should fail to update sweet with user role', async () => {
      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' })
        .expect(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should delete sweet with admin token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toMatch(/deleted/i);

      const deletedSweet = await Sweet.findById(sweetId);
      expect(deletedSweet).toBeNull();
    });

    it('should fail to delete sweet without authentication', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .expect(401);
    });

    it('should fail to delete sweet with user role', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      });
      sweetId = sweet._id;
    });

    it('should purchase sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(95);
      expect(response.body.message).toMatch(/purchased/i);
    });

    it('should fail to purchase without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 5 })
        .expect(401);
    });

    it('should fail to purchase more than available quantity', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 150 })
        .expect(400);
    });

    it('should fail to purchase with invalid quantity', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: -5 })
        .expect(400);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should restock sweet with admin token', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(100);
      expect(response.body.message).toMatch(/restocked/i);
    });

    it('should fail to restock without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 50 })
        .expect(401);
    });

    it('should fail to restock with user role', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);
    });

    it('should fail to restock with invalid quantity', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);
    });
  });
});
