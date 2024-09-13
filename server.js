const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const Food = require('./models/food');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Create a new food entry
app.post('/foods', async (req, res, next) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).send(food);
  } catch (error) {
    next(error); // Passes the error to the global error handler
  }
});

// Read all food entries
app.get('/foods', async (req, res, next) => {
  try {
    const foods = await Food.find();
    res.status(200).send(foods);
  } catch (error) {
    next(error);
  }
});

// Read a specific food entry
app.get('/foods/:id', async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).send({ error: 'Food not found' });
    }
    res.status(200).send(food);
  } catch (error) {
    next(error);
  }
});

// Update a food entry
app.put('/foods/:id', async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) {
      return res.status(404).send({ error: 'Food not found' });
    }
    res.status(200).send(food);
  } catch (error) {
    next(error);
  }
});

// Delete a food entry
app.delete('/foods/:id', async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).send({ error: 'Food not found' });
    }
    res.status(200).send({ message: 'Food deleted' });
  } catch (error) {
    next(error);
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging
  res.status(500).send({
    error: 'Something went wrong! Please try again later.',
    message: err.message
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
