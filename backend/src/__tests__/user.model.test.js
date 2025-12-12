import mongoose from 'mongoose';
import User from '../models/User.js';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user successfully', async () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    };

    const user = new User(validUser);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.role).toBe(validUser.role);
    expect(savedUser.password).not.toBe(validUser.password); // Should be hashed
  });

  it('should fail to create user without required fields', async () => {
    const userWithoutEmail = new User({
      name: 'John Doe',
      password: 'password123'
    });

    let error;
    try {
      await userWithoutEmail.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should hash password before saving', async () => {
    const user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'plainPassword123'
    });

    await user.save();
    expect(user.password).not.toBe('plainPassword123');
    expect(user.password.length).toBeGreaterThan(20); // Hashed passwords are longer
  });

  it('should compare password correctly', async () => {
    const password = 'testPassword123';
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password
    });

    await user.save();

    const isMatch = await user.comparePassword(password);
    const isNotMatch = await user.comparePassword('wrongPassword');

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should set default role to user', async () => {
    const user = new User({
      name: 'Default Role User',
      email: 'default@example.com',
      password: 'password123'
    });

    await user.save();
    expect(user.role).toBe('user');
  });

  it('should allow admin role', async () => {
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    await adminUser.save();
    expect(adminUser.role).toBe('admin');
  });
});
