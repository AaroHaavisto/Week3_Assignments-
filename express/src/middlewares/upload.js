import path from 'path';
import sharp from 'sharp';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const safeName = `${Date.now()}-${baseName}${extension}`;
    cb(null, safeName);
  },
});

const upload = multer({storage});

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  const originalPath = req.file.path;
  const extension = path.extname(originalPath);
  const baseName = path.basename(originalPath, extension);
  const thumbPath = path.join(
    path.dirname(originalPath),
    `${baseName}_thumb.png`
  );

  try {
    await sharp(originalPath).resize(160, 160).png().toFile(thumbPath);
    req.file.thumbnail = thumbPath;
    next();
  } catch (error) {
    next(error);
  }
};

export {upload, createThumbnail};
