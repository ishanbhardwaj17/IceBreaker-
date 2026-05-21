import express from 'express';

const authRouter = express.Router();
import { registerUser, loginUser, verifyOTP, getMe, logoutUser } from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';
/**
    * @route POST /api/auth/register 
    * @desc Register a new user
    * @access Public
 */
authRouter.post('/auth/register', registerUser);
/**
    * @route POST /api/auth/login 
    * @desc Login a user
    * @access Public
 */
authRouter.post('/auth/login', loginUser);

/**
    * @route POST /api/auth/logout
    * @desc Logout a user
    * @access Public
 */
authRouter.post('/auth/logout', logoutUser);

/**
 * @route POST /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 */
authRouter.post('/auth/verify-email', verifyOTP);

/**
 * @route GET /api/auth/me
 * @desc Get currently logged in user profile
 * @access Private
 */
authRouter.get('/auth/me', protect, getMe);

export default authRouter;
