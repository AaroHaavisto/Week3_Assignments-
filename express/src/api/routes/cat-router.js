import express from 'express';
import {upload} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {
  validateCatCreate,
  validateCatIdParam,
  validateCatUpdate,
  validateCatUserIdParam,
} from '../../middlewares/validation.js';
import {
  catDelete,
  catGet,
  catListGet,
  catsByUserGet,
  catPost,
  catPut,
} from '../controllers/cat-controller.js';

const router = express.Router();

router.route('/').get(catListGet).post(upload.single('cat'), validateCatCreate, catPost);
router.route('/user/:userId').get(validateCatUserIdParam, catsByUserGet);
router
  .route('/:id')
  .get(validateCatIdParam, catGet)
  .put(authenticateToken, validateCatIdParam, validateCatUpdate, catPut)
  .delete(authenticateToken, validateCatIdParam, catDelete);

export default router;
