import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import process from 'node:process';
import {findUserByUsername} from '../models/user-model.js';
import 'dotenv/config';

const postLogin = async (req, res, next) => {
  try {
    const user = await findUserByUsername(req.body.username);
    if (!user) {
      return res.sendStatus(401);
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.sendStatus(401);
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

const getMe = async (req, res) => {
  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    res.sendStatus(401);
  }
};

export {postLogin, getMe};
