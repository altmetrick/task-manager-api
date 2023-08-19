import express from 'express';
import { getUserInfo, updateUserInfo } from '../controllers/users.js';

const router = express.Router();

// '/users'
router.get('/me', getUserInfo);
router.put('/me', updateUserInfo);

export default router;
