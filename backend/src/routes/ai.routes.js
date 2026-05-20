import express from 'express';
const AiRouter = express.Router();
import { generateEmail, getHistory } from '../controllers/ai.controller.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @route POST /api/generate-email
 * @desc Generate a cold email using AI
 * @access Private  
 */
AiRouter.post('/generate-email', protect, generateEmail);
/**
 * @route GET /api/history
 * @desc Get user's email generation history
 * @access Private
 */
AiRouter.get('/history', protect, getHistory);

export default AiRouter;
