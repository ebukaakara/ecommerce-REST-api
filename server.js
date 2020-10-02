const express = require('express');
const mongoose = require('mongoose');
const postsRoute = require('./routes/posts');
const app = express();
const cors = require('cors');

// Serve dotenv files
require('dotenv/config');

// Connect database

mongoose
   .connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('MongoDB Connected...');
   })
   .catch(() => {
      console.error(err.message);
      process.exit(1);
   });

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/posts', postsRoute);

app.get('/', (req, res) => {
   res.send('Welcome');
});

// Listen to the port
app.listen(process.env.PORT || 5000, () => {
   console.log('good to go');
});
