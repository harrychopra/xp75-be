import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/profile.controller.js';

const router = Router();
router.use(authenticate);

router.patch('/', updateProfile);

export default router;
