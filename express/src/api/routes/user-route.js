import express from 'express';
import {authenticateToken} from '../../middlewares/authentication.js';
import {
  userDelete,
  userGet,
  userListGet,
  userPost,
  userPut,
} from '../controllers/user-controller.js';

const router = express.Router();

router.route('/').get(userListGet).post(userPost);
router
  .route('/:id')
  .get(userGet)
  .put(authenticateToken, userPut)
  .delete(authenticateToken, userDelete);

export default router;
