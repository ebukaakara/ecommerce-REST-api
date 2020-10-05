const express = require('express');
const authController = require('../controllers/auth');
const categoryController = require('../controllers/category');
const userController = require('../controllers/user');
const router = express.Router();

router.post(
   '/category/create/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   categoryController.create
);

router.put(
   '/category/:categoryId/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   categoryController.update
);

router.delete(
   '/category/:categoryId/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   categoryController.remove
);

router.get(
   '/category/:categoryId',
   categoryController.read
);
router.get('/categories', categoryController.list);

router.param('categoryId', categoryController.categoryById);

router.param('userId', userController.userById);

module.exports = router;
