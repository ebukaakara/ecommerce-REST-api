const express = require('express');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const router = express.Router();

router.get(
   '/secret/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   (req, res) => {
      res.json({
         user: req.profile,
      });
   }
);

router.get(
   '/user/:userId',
   authController.requireSignin,
   authController.isAuth,
   userController.read
);

router.put(
   '/secret/:userId',
   authController.requireSignin,
   authController.isAuth,
   userController.update
);

router.param('userId', userController.userById);

module.exports = router;
