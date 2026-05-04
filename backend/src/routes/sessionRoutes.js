import express from 'express';
import { createSession } from '../controllers/sessionController.js';
import { protect } from '../middleware/authmiddleware.js';
const router = express.Router();

router.post('/create',protect, createSession);

export default router;