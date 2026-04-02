import express from 'express';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the public folder
app.use('/public', express.static('public'));

// Hello World endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API endpoint for cats
app.get('/api/v1/cats', (req, res) => {
  const cat = {
    cat_id: 1,
    name: 'Whiskers',
    birthdate: '2020-05-15',
    weight: 4.5,
    owner: 'John Doe',
    image: 'https://loremflickr.com/320/240/cat',
  };
  res.json(cat);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
