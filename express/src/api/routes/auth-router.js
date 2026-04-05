import express from 'express';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validateLogin} from '../../middlewares/validation.js';

const authRouter = express.Router();

authRouter.route('/login').post(validateLogin, postLogin);
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
