import mongoose from 'mongoose';
import Sweet from '../models/Sweet.js';

describe('Sweet Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  it('should create a new sweet successfully', async () => {
    const validSweet = {
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.99,
      quantity: 100,
      description: 'Delicious milk chocolate bar'
    };

    const sweet = new Sweet(validSweet);
    const savedSweet = await sweet.save();

    expect(savedSweet._id).toBeDefined();
    expect(savedSweet.name).toBe(validSweet.name);
    expect(savedSweet.category).toBe(validSweet.category);
    expect(savedSweet.price).toBe(validSweet.price);
    expect(savedSweet.quantity).toBe(validSweet.quantity);
    expect(savedSweet.description).toBe(validSweet.description);
  });

  it('should fail to create sweet without required fields', async () => {
    const invalidSweet = new Sweet({
      name: 'Test Sweet'
      // Missing required fields: category, price (quantity has default)
    });

    let error;
    try {
      await invalidSweet.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.category).toBeDefined();
    expect(error.errors.price).toBeDefined();
  });

  it('should fail with negative price', async () => {
    const sweetWithNegativePrice = new Sweet({
      name: 'Test Sweet',
      category: 'Candy',
      price: -5.00,
      quantity: 10
    });

    let error;
    try {
      await sweetWithNegativePrice.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.price).toBeDefined();
  });

  it('should fail with negative quantity', async () => {
    const sweetWithNegativeQuantity = new Sweet({
      name: 'Test Sweet',
      category: 'Candy',
      price: 5.00,
      quantity: -10
    });

    let error;
    try {
      await sweetWithNegativeQuantity.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.quantity).toBeDefined();
  });

  it('should have default quantity of 0 if not provided', async () => {
    const sweet = new Sweet({
      name: 'Test Sweet',
      category: 'Candy',
      price: 5.00
    });

    const savedSweet = await sweet.save();
    expect(savedSweet.quantity).toBe(0);
  });

  it('should trim whitespace from name', async () => {
    const sweet = new Sweet({
      name: '  Chocolate Bar  ',
      category: 'Chocolate',
      price: 2.99,
      quantity: 10
    });

    const savedSweet = await sweet.save();
    expect(savedSweet.name).toBe('Chocolate Bar');
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const sweet = new Sweet({
      name: 'Test Sweet',
      category: 'Candy',
      price: 5.00,
      quantity: 10
    });

    const savedSweet = await sweet.save();
    expect(savedSweet.createdAt).toBeDefined();
    expect(savedSweet.updatedAt).toBeDefined();
  });

  it('should allow valid categories', async () => {
    const categories = ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Other'];
    
    for (const category of categories) {
      const sweet = new Sweet({
        name: `Test ${category}`,
        category,
        price: 5.00,
        quantity: 10
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.category).toBe(category);
      await Sweet.deleteMany({});
    }
  });

  it('should fail with invalid category', async () => {
    const sweet = new Sweet({
      name: 'Test Sweet',
      category: 'InvalidCategory',
      price: 5.00,
      quantity: 10
    });

    let error;
    try {
      await sweet.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.category).toBeDefined();
  });
});
