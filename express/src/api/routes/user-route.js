import express from 'express';
import {
  userDelete,
  userGet,
  userListGet,
  userPost,
  userPut,
} from '../controllers/user-controller.js';

const router = express.Router();

router.route('/').get(userListGet).post(userPost);
router.route('/:id').get(userGet).put(userPut).delete(userDelete);

export default router;
