import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controller.js';
import * as dayController from '../controllers/day.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/:day_number', dayController.get);
router.get('/', dayController.getAll);
router.post('/', dayController.create);
router.all('*_', methodNotAllowed);

export default router;
