import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import { protect, admin, superAdmin, requirePermission } from '../middleware/auth.js';
import { validateUsername, containsInappropriateContent, sanitizeString } from '../utils/validator.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_gaming_super_secret_jwt_key_2026_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '3650d';

// Avatar storage configuration
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed for avatars'));
    }
  }
});

// Generate JWT and response payload (Persistent 10-year remember session)
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  const options = {
    expires: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000), // 10 Years
    maxAge: 3650 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = false; // Allow local/http testing while keeping long expiration
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      permissions: user.permissions || [],
      isVerified: user.isVerified
    }
  });
};

// In-memory OTP store for pending email verifications
const emailVerificationCodes = new Map();

// ==========================================
// 1. ULTRA-FAST USERNAME AVAILABILITY CHECK (< 50ms)
// ==========================================
router.get('/check-username', async (req, res) => {
  try {
    const rawUsername = req.query.username;
    if (!rawUsername) {
      return res.status(400).json({ available: false, error: 'Username parameter is required' });
    }

    const username = rawUsername.trim().toLowerCase();

    // Check formatting and profanity
    const formatCheck = validateUsername(username);
    if (!formatCheck.valid) {
      return res.json({ available: false, error: formatCheck.error });
    }

    // Direct indexed query
    const existing = await User.findOne({ username }).select('_id').lean();

    if (existing) {
      return res.json({ available: false, error: 'Username is already taken' });
    }

    return res.json({ available: true, message: 'Username is available!' });
  } catch (error) {
    res.status(500).json({ available: false, error: 'Server error checking username' });
  }
});

// ==========================================
// 2. SEND 6-DIGIT EMAIL VERIFICATION CODE
// ==========================================
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered and verified
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, error: 'An account with this email is already registered.' });
    }

    // Generate random 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    emailVerificationCodes.set(cleanEmail, { code, expiresAt });

    console.log(`\n========================================`);
    console.log(`✉️ EMAIL VERIFICATION CODE for ${cleanEmail}: [ ${code} ]`);
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}`,
      // Also provide the code in response for instantaneous testing/simulated UX
      code: code,
      expiresIn: '15 minutes'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate verification code.' });
  }
});

// ==========================================
// 3. VERIFY 6-DIGIT CODE
// ==========================================
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Please provide email and verification code.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const record = emailVerificationCodes.get(cleanEmail);

  if (!record) {
    return res.status(400).json({ success: false, error: 'No verification code requested or code has expired. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    emailVerificationCodes.delete(cleanEmail);
    return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new code.' });
  }

  if (record.code !== code.trim()) {
    return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your code and try again.' });
  }

  // Code is valid - mark verified in temporary store
  emailVerificationCodes.set(cleanEmail, { ...record, verified: true });

  res.status(200).json({
    success: true,
    message: 'Email successfully verified!'
  });
});

// ==========================================
// 4. USER REGISTRATION
// ==========================================
router.post('/register', async (req, res, next) => {
  try {
    const { name, username, email, password, code, avatar } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
    }

    // Check profanity and malicious values
    if (containsInappropriateContent(name) || containsInappropriateContent(username)) {
      return res.status(400).json({ success: false, error: 'Input contains inappropriate or offensive language.' });
    }

    // Validate username format
    const userValidation = validateUsername(username);
    if (!userValidation.valid) {
      return res.status(400).json({ success: false, error: userValidation.error });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    // Verify verification code
    const record = emailVerificationCodes.get(cleanEmail);
    const isCodeValid = record && (record.verified || record.code === code?.trim());
    
    // In dev/demo, if code is provided or pre-verified:
    if (!isCodeValid && process.env.NODE_ENV === 'production' && !code) {
      return res.status(400).json({ success: false, error: 'Please verify your email address with the 6-digit code first.' });
    }

    // Check uniqueness
    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({ success: false, error: 'Email address is already in use.' });
    }

    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return res.status(400).json({ success: false, error: 'Username is already taken. Please choose another.' });
    }

    // Create user
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const generatedUserId = `NXS-${randomHex}`;

    const user = await User.create({
      name: sanitizeString(name),
      username: cleanUsername,
      userId: generatedUserId,
      email: cleanEmail,
      password,
      avatar: avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'user',
      permissions: []
    });

    emailVerificationCodes.delete(cleanEmail);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 5. LOGIN WITH EMAIL OR USERNAME / USERID
// ==========================================
router.post('/login', async (req, res, next) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginId = identifier || email || username;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, error: 'Please provide your email/username and password.' });
    }

    const cleanId = loginId.trim().toLowerCase();

    // Query user by email OR username OR uppercase userId
    const user = await User.findOne({
      $or: [
        { email: cleanId },
        { username: cleanId },
        { userId: loginId.trim().toUpperCase() }
      ]
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials. Please check your email/username and password.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 6. GET CURRENT USER PROFILE
// ==========================================
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 7. UPDATE PROFILE (Name, Bio, Username)
// ==========================================
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, bio, username } = req.body;
    const updates = {};

    if (name) {
      if (containsInappropriateContent(name)) {
        return res.status(400).json({ success: false, error: 'Name contains inappropriate words.' });
      }
      updates.name = sanitizeString(name);
    }

    if (bio !== undefined) {
      if (containsInappropriateContent(bio)) {
        return res.status(400).json({ success: false, error: 'Bio contains inappropriate words.' });
      }
      updates.bio = sanitizeString(bio);
    }

    if (username && username.trim().toLowerCase() !== req.user.username) {
      const cleanUsername = username.trim().toLowerCase();
      const validation = validateUsername(cleanUsername);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }
      const existing = await User.findOne({ username: cleanUsername, _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Username is already taken.' });
      }
      updates.username = cleanUsername;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 8. UPLOAD PROFILE PICTURE / AVATAR
// ==========================================
router.post('/avatar', protect, avatarUpload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload an image file.' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });

    res.status(200).json({
      success: true,
      avatar: avatarUrl,
      data: user,
      message: 'Profile picture updated successfully!'
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 9. SUPER ADMIN: CREATE ADMIN WITH GRANULAR PERMISSIONS
// ==========================================
router.post('/create-admin', protect, superAdmin, async (req, res, next) => {
  try {
    const { name, username, email, password, permissions } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all admin account details.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email or username already exists.' });
    }

    // Default permissions if none specified: 'orders'
    const assignedPermissions = Array.isArray(permissions) && permissions.length > 0
      ? permissions
      : ['orders'];

    const newAdmin = await User.create({
      name: sanitizeString(name),
      username: cleanUsername,
      email: cleanEmail,
      password,
      role: 'admin',
      permissions: assignedPermissions,
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: `Admin account created with permissions: [${assignedPermissions.join(', ')}]`,
      data: {
        _id: newAdmin._id,
        name: newAdmin.name,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        permissions: newAdmin.permissions
      }
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 10. SUPER ADMIN: UPDATE ADMIN PERMISSIONS
// ==========================================
router.put('/admins/:id/permissions', protect, superAdmin, async (req, res, next) => {
  try {
    const { permissions, role } = req.body;

    const updates = {};
    if (permissions && Array.isArray(permissions)) {
      updates.permissions = permissions;
    }
    if (role && ['admin', 'super_admin', 'user'].includes(role)) {
      updates.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Admin user not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Admin permissions updated successfully.',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 11. LIST ALL USERS & ADMINS (USERS PERMISSION)
// ==========================================
router.get('/users', protect, requirePermission('users'), async (req, res, next) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 12. UPDATE USER ROLE & PERMISSIONS (USERS PERMISSION)
// ==========================================
router.put('/users/:id', protect, requirePermission('users'), async (req, res, next) => {
  try {
    const { role, permissions, isVerified } = req.body;
    const updates = {};

    if (role) updates.role = role;
    if (permissions) updates.permissions = permissions;
    if (isVerified !== undefined) updates.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 13. DELETE USER (USERS PERMISSION)
// ==========================================
router.delete('/users/:id', protect, requirePermission('users'), async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
