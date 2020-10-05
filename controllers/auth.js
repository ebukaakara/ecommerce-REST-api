const User = require('../models/user');
const {
   errorHandler,
} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const dotenv = require('dotenv');
dotenv.config();

// To sign users up
exports.signup = (req, res) => {
   const user = new User(req.body);
   user.save((err, user) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({
         user,
      });
   });
};

// To log users in
exports.signin = (req, res) => {
   // Find user based on email
   const { email, password } = req.body;
   User.findOne({ email }, (err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: 'email does not exist. Please sign up',
         });
      }

      if (!user.authenticate(password)) {
         return res.status(400).json({
            error: 'email or password do not match',
         });
      }

      // Make sure email and password match
      const token = jwt.sign(
         { _id: user._id },
         process.env.JWT_SECRET
      );

      // persist the token in a cookie with expiry date
      res.cookie('t', token, { expire: new Date() + 9999 });

      // return response to client
      const { _id, name, email, role } = user;
      return res.json({
         token,
         user: { _id, name, email, role },
      });
   });
};

// log users out of app
exports.signout = (req, res) => {
   res.clearCookie('t');
   res.json({ message: 'You just logged out' });
};

// Middleware to require jwt
exports.requireSignin = expressJwt({
   secret: process.env.JWT_SECRET,
   algorithms: ['RS256'], // added later
   userProperty: 'auth',
});

// for authenticated user
exports.isAuth = (req, res, next) => {
   let user =
      req.profile &&
      req.auth &&
      req.profile._id == req.auth.id;
   if (!user) {
      return res.status(400).json({
         error: 'Access Denied',
      });
   }
   next();
};

// for admin users
exports.isAdmin = (req, res, next) => {
   if (req.profile.role === 0) {
      return res.status(400).json({
         error: 'Admin resource. Access Denied',
      });
   }
   next();
};
