import express from 'express';
import { respondToInterview } from '../controllers/interviewController.js';
import { protect } from '../middleware/authmiddleware.js';



const router = express.Router();

router.post('/respond',protect,respondToInterview);

export default router;
