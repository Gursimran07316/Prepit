import express, { Router } from 'express';
import { createSession, getSessionById, getSessions } from '../controllers/sessionController.js';
import { protect } from '../middleware/authmiddleware.js';
const router = express.Router();

router.post('/create',protect, createSession);
router.get('/get',protect, getSessions);
router.get('/:id',protect, getSessionById);
export default router;