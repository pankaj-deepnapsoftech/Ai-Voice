import { Router } from 'express';
import UserRoutes from './user.routes.js';
import HistoryRoutes from "./History.routes.js";

const router = Router();
router.use('/user', UserRoutes);
router.use('/history', HistoryRoutes);

export default router;
