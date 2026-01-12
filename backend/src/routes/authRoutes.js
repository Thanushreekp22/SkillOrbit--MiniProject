import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL + '/login?error=oauth_failed',
    session: false
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user._id,
          email: req.user.email,
          name: req.user.name
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendURL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePhoto: req.user.profilePhoto
      }))}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(process.env.FRONTEND_URL + '/login?error=token_generation_failed');
    }
  }
);

export default router;
