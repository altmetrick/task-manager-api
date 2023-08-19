import express from 'express';

import { createTask, deleteTask, getAllUserTasks, updateTask } from '../controllers/tasks.js';

const router = express.Router();

// /tasks
router
  .get('/', getAllUserTasks)
  .post('/', createTask)
  .patch('/:id', updateTask)
  .delete('/:id', deleteTask);

export default router;
