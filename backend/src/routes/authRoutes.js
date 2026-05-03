import express from 'express'
import { register ,login} from '../controllers/authController.js'
// 👇 your job — import register and login from authController


const router = express.Router()

// 👇 your job — define two POST routes
// POST /register  → register controller
// POST /login     → login controller
router.post('/register',register);
router.post('/login',login);

export default router