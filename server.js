const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

// Serve dotenv files
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Database Connection

mongoose
   .connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('Database Connected');
   })
   .catch((err) => {
      console.error(err.message);
      process.exit(1);
   });

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// Listen to the port
app.listen(process.env.PORT || 8000, () => {
   console.log('Server connected');
});
