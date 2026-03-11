import { Router } from 'express';
import { startDay } from '../controllers/day.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/', startDay);

export default router;
