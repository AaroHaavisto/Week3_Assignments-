import {addUser, getAllUsers, getUserById} from '../models/user-model.js';

const userListGet = (req, res) => {
  res.json(getAllUsers());
};

const userGet = (req, res) => {
  const id = Number(req.params.id);
  const user = getUserById(id);

  if (!user) {
    return res.status(404).json({message: 'User not found.'});
  }

  return res.json(user);
};

const userPost = (req, res) => {
  const newUser = addUser(req.body);
  res.status(201).json(newUser);
};

const userPut = (req, res) => {
  res.json({message: 'User item updated.'});
};

const userDelete = (req, res) => {
  res.json({message: 'User item deleted.'});
};

export {userListGet, userGet, userPost, userPut, userDelete};
