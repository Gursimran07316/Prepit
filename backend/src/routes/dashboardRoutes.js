import express from 'express'
import { dashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authmiddleware.js';




const router = express.Router()


router.get('/',protect,dashboard);


export default router