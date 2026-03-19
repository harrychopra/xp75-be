import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controller.js';
import * as dayController from '../controllers/day.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/:day_number', dayController.get);
router.get('/', dayController.getAll);
router.post('/', upload.single('progress_pic'), dayController.create);
router.all('*_', methodNotAllowed);

export default router;
