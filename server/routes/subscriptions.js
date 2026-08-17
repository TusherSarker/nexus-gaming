import express from 'express';
import Subscription from '../models/Subscription.js';
import { protect, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ active: true }).sort('order');
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ success: false, error: 'Subscription not found' });
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, requirePermission('subscriptions'), async (req, res, next) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, requirePermission('subscriptions'), async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!subscription) return res.status(404).json({ success: false, error: 'Subscription not found' });
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, requirePermission('subscriptions'), async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) return res.status(404).json({ success: false, error: 'Subscription not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
