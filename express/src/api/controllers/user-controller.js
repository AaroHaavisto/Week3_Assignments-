import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../models/user-model.js';

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
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({message: 'User not found.'});
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (req, res, next) => {
  try {
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const userPut = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updatedUser = await updateUser(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({message: 'User not found.'});
    }

    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const userDelete = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deletedRows = await deleteUser(id);

    if (deletedRows === 0) {
      return res.status(404).json({message: 'User not found.'});
    }

    return res.json({message: 'User and related cats deleted.'});
  } catch (error) {
    next(error);
  }
};

export {userListGet, userGet, userPost, userPut, userDelete};
