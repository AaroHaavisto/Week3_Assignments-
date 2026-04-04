import express from 'express';
import {upload} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {
  catDelete,
  catGet,
  catListGet,
  catsByUserGet,
  catPost,
  catPut,
} from '../controllers/cat-controller.js';

const router = express.Router();

router.route('/').get(catListGet).post(upload.single('cat'), catPost);
router.route('/user/:userId').get(catsByUserGet);
router
  .route('/:id')
  .get(catGet)
  .put(authenticateToken, catPut)
  .delete(authenticateToken, catDelete);

export default router;
