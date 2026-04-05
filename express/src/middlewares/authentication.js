import jwt from 'jsonwebtoken';
import process from 'node:process';
import 'dotenv/config';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return next(createError('Missing bearer token.', 401));
  }

  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(createError('Invalid token.', 403));
  }
};

export {authenticateToken};
