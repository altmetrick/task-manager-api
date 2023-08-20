import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/createError.js';
import User from '../models/User.js';

//
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1 - check provided user data
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'User name, email, and password are required!' });
  }

  // 2 - search for duplicates in the db
  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    //409 conflict
    return res.status(409).json({ message: `Email ${email} is already taken.` });
  }

  try {
    // 3 - encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4 - create and store a new user in the db
    const newUser = await User.create({ name, email, password: hashedPassword });

    // 5 - creating and sending access token in cookie for just registered user
    const payload = {
      userId: newUser._id,
      name: newUser.name,
    };

    const accessToken = await jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    return res
      .cookie('access_token', accessToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', // cookie will be sent from client on different domain
      })
      .status(200)
      .json({
        user: { name: newUser.name, email: newUser.email },
        message: `User ${newUser.name} successfully registered`,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1 check credentials
  if (!email || !password) {
    return next(createError({ status: 403, message: 'User email and password are required!' }));
  }

  try {
    // 2 find user in the users db
    const foundUser = await User.findOne({ email }).exec();

    // 3 check if user is found
    if (!foundUser) {
      // return res.status(404).json({ message: 'Invalid credentials!' });
      return next(createError({ status: 404, message: 'Invalid credentials!' }));
    }

    // 4 check if provided password corresponds to the password stored in db
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordCorrect) {
      //REMOVE '(password) from the message'
      return next(createError({ status: 401, message: 'Invalid credentials (password)!' }));
    }

    // 5 if provided password is equal to the password from the db
    // We need to create jwt token and send it with cookie to the user (on client);

    // 5.1 create payload for token
    const payload = {
      userId: foundUser._id,
      name: foundUser.name,
    };

    // 5.2 create jwt access token
    const accessToken = await jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    // 5.3 sent access token in cookie and info about user  on the client
    return res
      .cookie('access_token', accessToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', // cookie will be sent from client on different domain
      })
      .status(200)
      .json({
        user: { name: foundUser.name, email: foundUser.email },
        message: `User ${foundUser.name} successfully loged-in`,
      });
    //
  } catch (err) {
    //return res.status(500).json({ message: err.message });
    return next(createError({ status: 500, message: err.message }));
  }
};

export const logout = (req, res, next) => {
  res.clearCookie('access_token');
  return res.status(200).json({ message: 'Logout success!' });
};

export const isLoggedIn = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.json({ isLoggedIn: false });
  }

  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err) => {
    if (err) {
      return res.json({ isLoggedIn: false });
    }

    return res.json({ isLoggedIn: true });
  });
};
