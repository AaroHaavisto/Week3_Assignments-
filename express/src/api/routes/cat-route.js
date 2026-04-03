import express from 'express';
import {createThumbnail, upload} from '../../middlewares/upload.js';
import {
  catDelete,
  catGet,
  catListGet,
  catPost,
  catPut,
} from '../controllers/cat-controller.js';

const router = express.Router();

router
  .route('/')
  .get(catListGet)
  .post(upload.single('image'), createThumbnail, catPost);
router.route('/:id').get(catGet).put(catPut).delete(catDelete);

export default router;
