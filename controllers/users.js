import User from '../models/User.js';
import { createError } from '../utils/createError.js';

export const getUserInfo = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select('name email');
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

export const updateUserInfo = async (req, res, next) => {
  //Reading userId from previously decoded access token
  const { userId } = req.user;
  const { name, email } = req.body;

  if (!name && !email) {
    return next(createError({ status: 400, message: 'User name or email is required!' }));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { name, email },
      { new: true, runValidators: true }
    ).select('name email');

    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
};
