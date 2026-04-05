import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import process from 'node:process';
import {findUserByUsername} from '../models/user-model.js';
import 'dotenv/config';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const postLogin = async (req, res, next) => {
  try {
    const body = req.body ?? {};
    if (!body.username || !body.password) {
      return next(createError('Missing username or password.', 400));
    }

    const user = await findUserByUsername(body.username);
    if (!user) {
      return next(createError('Invalid credentials.', 401));
    }

    const isBcryptHash = typeof user.password === 'string' && user.password.startsWith('$2');
    const passwordMatch = isBcryptHash
      ? await bcrypt.compare(body.password, user.password)
      : body.password === user.password;
    if (!passwordMatch) {
      return next(createError('Invalid credentials.', 401));
    }

    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.json({user: userWithNoPassword, token});
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    next(createError('Unauthorized', 401));
  }
};

export {postLogin, getMe};
