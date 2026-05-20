import express from 'express';

const authRouter = express.Router();
import { registerUser, loginUser,verifyOTP } from '../controllers/auth.controller.js';
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
 * @route POST /api/auth/verify-email
 * @desc Verify user's email
 * @access Public
 */
authRouter.post('/auth/verify-email', verifyOTP);

export default authRouter;