require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Value = require('./models/Value');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));
  const initialKey = 'initialKey';
  const initialValue = '10';
// Endpoint to check if the app is running
app.get('/', async (req, res) => {
    try {
      let value = await Value.findOne({ key: initialKey });
      console.log(value.value);
      if (!value) {
        value = new Value({ key: initialKey, value: initialValue });
        await value.save();
        res.send(`hello node app is running and initial value is set to ${initialValue}`);
      } else {
        res.send(`hello node app is running and value is ${value.value}`);
      }
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  });

// Endpoint to fetch a value from the database
app.get('/value/:key', async (req, res) => {
  const key = req.params.key;
  try {
    const value = await Value.findOne({ key });
    if (value) {
      res.json(value);
    } else {
      res.status(404).send('Value not found');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Endpoint to update a value in the database
app.put('/value/:key', async (req, res) => {
  const key = req.params.key;
  const newValue = req.body.value;

  try {
    let value = await Value.findOne({ key });
    if (value) {
      value.value = newValue;
      await value.save();
      res.json(value);
    } else {
      value = new Value({ key, value: newValue });
      await value.save();
      res.json(value);
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});
app.get('/update/:key', async (req, res) => {
    const key = req.params.key;
    const newValue = req.query.value;
  
    if (!newValue) {
      return res.status(400).send('Value query parameter is required');
    }
  
    try {
      let value = await Value.findOne({ key });
      if (value) {
        value.value = newValue;
        await value.save();
        res.json(value);
      } else {
        value = new Value({ key, value: newValue });
        await value.save();
        res.json(value);
      }
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
