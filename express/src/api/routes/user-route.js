import express from 'express';
import {authenticateToken} from '../../middlewares/authentication.js';
import {
  validateUserCreate,
  validateUserIdParam,
  validateUserUpdate,
} from '../../middlewares/validation.js';
import {
  userDelete,
  userGet,
  userListGet,
  userPost,
  userPut,
} from '../controllers/user-controller.js';

const router = express.Router();

router.route('/').get(userListGet).post(validateUserCreate, userPost);
router
  .route('/:id')
  .get(validateUserIdParam, userGet)
  .put(authenticateToken, validateUserIdParam, validateUserUpdate, userPut)
  .delete(authenticateToken, validateUserIdParam, userDelete);

export default router;
