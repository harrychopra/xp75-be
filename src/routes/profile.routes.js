import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controllers.js';
import {
  changePassword,
  getProfile,
  updateProfile
} from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.patch('/password', changePassword);
router.all('*_', methodNotAllowed);

export default router;
