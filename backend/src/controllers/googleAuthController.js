'use strict';

const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/auth');

const client = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

/**
 * POST /api/user/google-auth
 * Body: { credential: <Google ID token from frontend> }
 */
exports.googleAuth = async (req, res, next) => {
  try {
    if (!client) {
      return res.status(503).json({
        success: false,
        message: 'Google Auth is not configured. Add GOOGLE_CLIENT_ID to .env.',
      });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required.' });
    }

    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ success: false, message: 'Invalid Google token.' });
    }

    const { email, name, sub: googleId } = payload;

    // Find existing user or create one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
      });
    } else if (!user.googleId) {
      // Link Google ID to existing email/password account
      user.googleId = googleId;
      await user.save();
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
