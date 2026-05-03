import express from 'express'
import { dashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authmiddleware.js';

// 👇 your job — import register and login from authController


const router = express.Router()

// 👇 your job — define two POST routes
// POST /register  → register controller
// POST /login     → login controller
router.get('/',protect,dashboard);


export default router