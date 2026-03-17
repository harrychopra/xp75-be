import { Router } from 'express';
import {
  getAPIVersion
} from '../controllers/api.controller.js';

const router = Router();
router.get('/version', getAPIVersion);
export default router;
