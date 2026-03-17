import { Router } from 'express';
import { methodNotAllowed } from '../controllers/api.controller.js';
import {
  login,
  logout,
  refresh,
  register
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.all('*_', methodNotAllowed);

export default router;
