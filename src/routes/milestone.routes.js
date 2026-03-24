import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controller.js';
import * as milestoneController from '../controllers/milestone.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', milestoneController.getAll);
router.all('*_', methodNotAllowed);

export default router;
