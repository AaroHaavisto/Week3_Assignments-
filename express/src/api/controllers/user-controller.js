import bcrypt from 'bcrypt';
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../models/user-model.js';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const userListGet = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(createError('Invalid user id.', 400));
    }
    const user = await getUserById(id);

    if (!user) {
      return next(createError('User not found.', 404));
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (req, res, next) => {
  try {
    const body = req.body ?? {};
    if (!body.name || !body.username || !body.email || !body.password) {
      return next(createError('Missing required user fields.', 400));
    }

    body.password = bcrypt.hashSync(body.password, 10);
    const newUser = await addUser(body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const userPut = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(createError('Invalid user id.', 400));
    }

    if (res.locals.user.user_id !== id && res.locals.user.role !== 'admin') {
      return next(createError('Forbidden', 403));
    }

    const body = req.body ?? {};
    if (!body.name || !body.username || !body.email) {
      return next(createError('Missing required user fields.', 400));
    }

    const updatedUser = await updateUser(id, body, res.locals.user);

    if (!updatedUser) {
      return next(createError('User not found.', 404));
    }

    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const userDelete = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next(createError('Invalid user id.', 400));
    }

    if (res.locals.user.user_id !== id && res.locals.user.role !== 'admin') {
      return next(createError('Forbidden', 403));
    }

    const deletedRows = await deleteUser(id, res.locals.user);

    if (deletedRows === 0) {
      return next(createError('User not found.', 404));
    }

    return res.json({message: 'User and related cats deleted.'});
  } catch (error) {
    next(error);
  }
};

export {userListGet, userGet, userPost, userPut, userDelete};
