import dotenv from 'dotenv';

// Load environment variables before tests run
dotenv.config();

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test';
