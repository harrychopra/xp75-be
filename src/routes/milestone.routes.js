import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controller.js';
import {
  getAll
} from '../controllers/milestone.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getAll);
router.all('*_', methodNotAllowed);

export default router;
