import express from 'express';
import { loginAdmin, getMe, logoutAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { verifyAdminAccess } from '../middleware/adminAccessMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Verify secret key — used by frontend before showing login form
router.get('/verify-access', verifyAdminAccess, (req, res) => {
  res.status(200).json({ success: true })
});

// login: verifyAdminAccess + loginLimiter only, NO protect
// @desc    Login admin
// @route   POST /api/auth/login
router.post('/login', verifyAdminAccess, loginLimiter, loginAdmin)

// @desc    Get current logged in admin
// @route   GET /api/auth/me
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutAdmin)

export default router;