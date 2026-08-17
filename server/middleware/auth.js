import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_gaming_super_secret_jwt_key_2026_production';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User no longer exists.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
  }
};

// Ensure user is an admin or super admin
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied: Admin privileges required.' });
  }
};

// Ensure user is a super admin
export const superAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'super_admin' || (req.user.permissions && req.user.permissions.includes('all')))) {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied: Super Admin privileges required.' });
  }
};

// Granular Role-Based Access Control (RBAC) permission guard
export const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    // Super Admins or users with 'all' permission have unrestricted access
    if (req.user.role === 'super_admin' || (req.user.permissions && req.user.permissions.includes('all'))) {
      return next();
    }

    // Check if the user has any of the required permissions
    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.some(perm => userPermissions.includes(perm));

    if (hasPermission) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Access Denied: You do not have permission to manage '${permissions.join(', ')}'.`,
      requiredPermissions: permissions,
      yourPermissions: userPermissions
    });
  };
};
