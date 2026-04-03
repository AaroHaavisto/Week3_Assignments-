import express from 'express';
import catRouter from './api/routes/cat-route.js';
import userRouter from './api/routes/user-route.js';

const app = express();

// Middleware to parse JSON
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

export default app;
