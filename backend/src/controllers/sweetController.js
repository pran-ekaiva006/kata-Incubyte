import Sweet from '../models/Sweet.js';

// @desc    Create a new sweet
// @route   POST /api/sweets
// @access  Private/Admin
export const createSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json({ sweet });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.status(200).json({ 
      sweets,
      count: sweets.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Public
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.status(200).json({ 
      sweets,
      count: sweets.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json({ sweet });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    res.status(200).json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Purchase a sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
export const purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient quantity available' 
      });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({ 
      sweet,
      message: `Successfully purchased ${quantity} ${sweet.name}(s)` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Restock a sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
export const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({ 
      sweet,
      message: `Successfully restocked ${quantity} ${sweet.name}(s)` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
