import { Router } from 'express';
import { AuthService } from '../services/auth.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidators.js';

const router = Router();

// POST /api/auth/register
router.post('/register', authRateLimiter, async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const { user, token } = await AuthService.register(validated);

    // Set HTTP-only secure cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: { user, token },
      message: 'Account created successfully.',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { user, token } = await AuthService.login(validated);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { user, token },
      message: 'Welcome back!',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await AuthService.getMe(req.user!._id);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = updateProfileSchema.parse(req.body);
    const user = await AuthService.updateProfile(req.user!._id, validated);
    res.json({ success: true, data: { user }, message: 'Profile updated.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = changePasswordSchema.parse(req.body);
    const result = await AuthService.changePassword(req.user!._id, validated.currentPassword, validated.newPassword);
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authRateLimiter, async (req, res, next) => {
  try {
    const validated = forgotPasswordSchema.parse(req.body);
    const result = await AuthService.forgotPassword(validated.email);
    res.json({ success: true, message: result.message, resetToken: result.resetToken });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authRateLimiter, async (req, res, next) => {
  try {
    const validated = resetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(validated.token, validated.newPassword);
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
});

export default router;
