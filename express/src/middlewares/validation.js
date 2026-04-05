import {body, param, validationResult} from 'express-validator';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const handleValidation = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(createError('Validation failed.', 400));
};

const validateUserIdParam = [
  param('id').isInt({min: 1}).withMessage('Invalid user id.'),
  handleValidation,
];

const validateCatIdParam = [
  param('id').isInt({min: 1}).withMessage('Invalid cat id.'),
  handleValidation,
];

const validateCatUserIdParam = [
  param('userId').isInt({min: 1}).withMessage('Invalid user id.'),
  handleValidation,
];

const validateUserCreate = [
  body('name').trim().isLength({min: 2, max: 100}).escape(),
  body('username').trim().isLength({min: 3, max: 50}).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').trim().isLength({min: 6, max: 100}),
  body('role').optional().trim().isIn(['user', 'admin']).escape(),
  handleValidation,
];

const validateUserUpdate = [
  body('name').trim().isLength({min: 2, max: 100}).escape(),
  body('username').trim().isLength({min: 3, max: 50}).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('role').optional().trim().isIn(['user', 'admin']).escape(),
  handleValidation,
];

const validateLogin = [
  body('username').trim().isLength({min: 1, max: 50}).escape(),
  body('password').trim().isLength({min: 1, max: 100}),
  handleValidation,
];

const validateCatCreate = [
  body('cat_name').trim().isLength({min: 2, max: 100}).escape(),
  body('birthdate').trim().isISO8601({strict: true}),
  body('weight').isFloat({min: 0, max: 100}).toFloat(),
  body('owner').isInt({min: 1}).toInt(),
  handleValidation,
];

const validateCatUpdate = [
  body('name').trim().isLength({min: 2, max: 100}).escape(),
  body('birthdate').trim().isISO8601({strict: true}),
  body('weight').isFloat({min: 0, max: 100}).toFloat(),
  body('owner').isInt({min: 1}).toInt(),
  handleValidation,
];

export {
  handleValidation,
  validateUserIdParam,
  validateCatIdParam,
  validateCatUserIdParam,
  validateUserCreate,
  validateUserUpdate,
  validateLogin,
  validateCatCreate,
  validateCatUpdate,
};