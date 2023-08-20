import Task from '../models/Task.js';
import { createError } from '../utils/createError.js';

export const getAllUserTasks = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const tasks = await Task.find({ userId }).exec();

    res.status(201).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  const { userId } = req.user;
  const { title, body } = req.body;

  try {
    const newTask = await Task.create({
      userId,
      title,
      body,
    });
    return res.status(201).json({ task: newTask, message: 'New task was created!' });
  } catch (err) {
    return next(err);
  }
};

export const updateTask = async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { title, body, completed } = req.body;

  try {
    const foundTask = await Task.findById(id);

    if (!foundTask) {
      return next(createError({ status: 404, message: `task with id: ${id} does not exist` }));
    }
    //check if found task is belongs to current user
    if (foundTask.userId.toString() !== userId) {
      return next(createError({ status: 404, message: 'It is not your task.' }));
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id },
      { title, body, completed },
      { new: true, runValidators: true }
    ).exec();

    return res.status(200).json({ task: updatedTask, message: 'Task successfuly updated!' });
  } catch (err) {
    return next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id }).exec();

    if (!deletedTask) {
      return next(createError({ status: 404, message: `Task with id: ${id} does not exist` }));
    }
    //check if current task is belongs to current user
    if (deletedTask.userId.toString() !== userId) {
      return next(createError({ status: 404, message: 'It is not your task.' }));
    }

    return res.status(200).json({ task: deletedTask, message: 'task was deleted!' });
  } catch (err) {
    return next(err);
  }
};
