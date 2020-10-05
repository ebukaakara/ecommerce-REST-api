const express = require('express');
const authController = require('../controllers/auth');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const userController = require('../controllers/user');
const router = express.Router();

router.post(
   '/product/create/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   productController.create
);

router.delete(
   '/product/:productId/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   productController.remove
);

router.put(
   '/product/:productId/:userId',
   authController.requireSignin,
   authController.isAuth,
   authController.isAdmin,
   productController.update
);

router.get('/product/:productId', productController.read);
router.get('/products', productController.list);
router.get(
   '/product/photo/:productId',
   productController.photo
);
router.get(
   '/products/related/:productId',
   productController.listRelated
);
router.get(
   '/products/categories',
   productController.listCategories
);

router.post(
   '/products/by/search',
   productController.listBySearch
);

router.param('userId', userController.userById);
router.param('productId', productController.productById);

module.exports = router;
