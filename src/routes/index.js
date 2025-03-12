import { Router } from 'express';
import UserRoutes from './user.routes.js';

const router = Router();
router.use('/user', UserRoutes);

export default router;
