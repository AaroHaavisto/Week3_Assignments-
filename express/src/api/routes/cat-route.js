import express from 'express';
import {
  catDelete,
  catGet,
  catListGet,
  catPost,
  catPut,
} from '../controllers/cat-controller.js';

const router = express.Router();

router.route('/').get(catListGet).post(catPost);
router.route('/:id').get(catGet).put(catPut).delete(catDelete);

export default router;
