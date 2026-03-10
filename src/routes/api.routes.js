import { Router } from 'express';
import { getAPIVersion } from '../controllers/api.controllers.js';

const router = Router();
router.get('/', getAPIVersion);

export default router;
