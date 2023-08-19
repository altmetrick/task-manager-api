import express from 'express';

import authRoutes from './auth.js';
import tasksRoutes from './tasks.js';
import usersRoutes from './users.js';
import { verifyJWT } from '../utils/verifyJWT.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', verifyJWT, tasksRoutes);
router.use('/users', verifyJWT, usersRoutes);

export default router;
