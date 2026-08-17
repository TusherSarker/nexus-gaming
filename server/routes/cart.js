import express from 'express';
import Cart from '../models/Cart.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const optionalAuth = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (error) {}
  }
  next();
};

const getCart = async (req) => {
  let query = {};
  if (req.user) query.user = req.user.id;
  else if (req.query.sessionId) query.sessionId = req.query.sessionId;
  else return null;

  let cart = await Cart.findOne(query).populate('items.product');
  if (!cart) cart = await Cart.create(query);
  return cart;
};

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    if (!req.user && !req.query.sessionId) {
      return res.status(400).json({ success: false, error: 'User or sessionId required' });
    }
    const cart = await getCart(req);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.post('/', optionalAuth, async (req, res, next) => {
  try {
    if (!req.user && !req.query.sessionId) {
      return res.status(400).json({ success: false, error: 'User or sessionId required' });
    }
    const cart = await getCart(req);
    const { product, qty } = req.body;

    const itemIndex = cart.items.findIndex(p => p.product._id.toString() === product);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty += (qty || 1);
    } else {
      cart.items.push({ product, qty: qty || 1 });
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.put('/:itemId', optionalAuth, async (req, res, next) => {
  try {
    const cart = await getCart(req);
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(p => p._id.toString() === req.params.itemId);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty = req.body.qty;
      await cart.save();
      await cart.populate('items.product');
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.delete('/:itemId', optionalAuth, async (req, res, next) => {
  try {
    const cart = await getCart(req);
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    cart.items = cart.items.filter(p => p._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.delete('/', optionalAuth, async (req, res, next) => {
  try {
    const cart = await getCart(req);
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

export default router;
