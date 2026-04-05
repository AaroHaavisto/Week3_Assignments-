import express from 'express';
import cors from 'cors';
import authRouter from './api/routes/auth-router.js';
import catRouter from './api/routes/cat-router.js';
import userRouter from './api/routes/user-route.js';
import {errorHandler, notFoundHandler} from './middlewares/error-handlers.js';

const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Hello World endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/cats', catRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
