import express from 'express';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSweets);
router.get('/search', searchSweets);

// Protected routes (require authentication)
router.post('/:id/purchase', protect, purchaseSweet);

// Admin only routes
router.post('/', protect, authorize('admin'), createSweet);
router.put('/:id', protect, authorize('admin'), updateSweet);
router.delete('/:id', protect, authorize('admin'), deleteSweet);
router.post('/:id/restock', protect, authorize('admin'), restockSweet);

export default router;
