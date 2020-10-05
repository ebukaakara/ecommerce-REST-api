const express = require('express');
const authController = require('../controllers/auth');
const validators = require('../validators/index');
const router = express.Router();

router.post(
   '/signup',
   validators.userSignupValidator,
   authController.signup
);

router.post('/signin', authController.signin);

router.get('/signout', authController.signout);

module.exports = router;
