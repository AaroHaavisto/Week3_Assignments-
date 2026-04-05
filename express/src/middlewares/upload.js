import multer from 'multer';

const upload = multer({
	dest: 'uploads/',
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
			cb(null, true);
			return;
		}

		const error = new Error('Only images and videos are allowed!');
		error.status = 400;
		cb(error, false);
	},
});

export {upload};
