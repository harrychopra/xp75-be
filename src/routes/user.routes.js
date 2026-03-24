import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controller.js';
import {
  changePassword,
  get,
  update
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', get);
router.patch('/', upload.single('avatar_pic'), update);
router.patch('/password', changePassword);
router.all('*_', methodNotAllowed);

export default router;
