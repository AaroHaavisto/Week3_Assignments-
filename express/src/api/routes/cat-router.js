import express from 'express';
import {upload} from '../../middlewares/upload.js';
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
router.route('/:id').get(catGet).put(catPut).delete(catDelete);

export default router;
