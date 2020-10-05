const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const {
   errorHandler,
} = require('../helpers/dbErrorHandler');
const product = require('../models/product');

// id a product
exports.productById = (req, res, next) => {
   Product.findById(id).exec((err, product) => {
      if (err || !product) {
         return res.status(400).json({
            error: 'Product not found',
         });
      }
      req.product = product;
      next();
   });
};

// Create a new product
exports.create = (req, res) => {
   // get the form data ready
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req, (err, fields, files) => {
      if (err) {
         return res.status(400).json({
            error: 'Image could not be uploaded',
         });
      }

      // check for all fields
      const {
         name,
         description,
         quantity,
         price,
         category,
         shipping,
      } = fields;

      if (
         !name ||
         !description ||
         !quantity ||
         !price ||
         !category ||
         !shipping
      ) {
         return res.status(400).json({
            error: 'All fields are required',
         });
      }

      // create new product
      let product = new Product(fields);

      // handle the photo files
      if (files.photo) {
         // restrict the photo size
         if (files.photo.size > 1000000) {
            return res.status(400).json({
               error: 'image should be less than 1mb',
            });
         }
         // Add the photo to the product
         product.photo.data = fs.readFileSync(
            files.photo.path
         );
         product.photo.contentType = files.photo.type;
      }
      // Save the photo in the database
      product.save(
         (err,
         (result) => {
            if (err) {
               return res.status(400).json({
                  error: errorHandler(error),
               });
            }
            res.json(result);
         })
      );
   });
};

// read a product
exports.read = (req, res) => {
   req.product.photo = undefined;
   return res.json(req.product);
};

// delete a product
exports.remove = (req, res) => {
   let product = req.product;
   Product.remove((err, deletedProduct) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      res.json({
         message: 'Product deleted successfully',
      });
   });
};

// update a product
exports.update = (req, res) => {
   // get the form data ready
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req, (err, fields, files) => {
      if (err) {
         return res.status(400).json({
            error: 'Image could not be uploaded',
         });
      }

      // check for all fields
      const {
         name,
         description,
         quantity,
         price,
         category,
         shipping,
      } = fields;

      if (
         !name ||
         !description ||
         !quantity ||
         !price ||
         !category ||
         !shipping
      ) {
         return res.status(400).json({
            error: 'All fields are required',
         });
      }

      // update existing product
      let product = req.product;
      product = _.extend(product, fields);

      // handle the photo files
      if (files.photo) {
         // restrict the photo size
         if (files.photo.size > 1000000) {
            return res.status(400).json({
               error: 'image should be less than 1mb',
            });
         }
         // Add the photo to the product
         product.photo.data = fs.readFileSync(
            files.photo.path
         );
         product.photo.contentType = files.photo.type;
      }
      // Save the photo in the database
      product.save(
         (err,
         (result) => {
            if (err) {
               return res.status(400).json({
                  error: errorHandler(error),
               });
            }
            res.json(result);
         })
      );
   });
};

// sell & arrival

// sell - /products?sortBy=sold&order=desc&limit=4
// arrival - /products?sortBy=createdAt&order=desc&limit=4

// if no params, return all products
exports.list = (req, res) => {
   let order = req.query.order ? req.query.order : 'asc';
   let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
   let limit = req.query.limit
      ? parseInt(req.query.limit)
      : 6;

   Product.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) => {
         if (err) {
            return res.status(400).json({
               error: 'Product not found',
            });
         }
         res.json(products);
      });
};

// find products based on req product category
// products with the same category will be returned
// return all related products
exports.listRelated = (req, res) => {
   let limit = req.query.limit
      ? parseInt(req.query.limit)
      : 6;

   Product.find({
      _id: { $ne: req.product },
      category: req.product.category,
   })
      .limit(limit)
      .populate('category', '_id name')
      .exec((err, products) => {
         if (err) {
            return res.status(400).json({
               error: 'Products not found',
            });
         }
         res.json(products);
      });
};

// list product categories
exports.listCategories = (req, res) => {
   Product.distinct('category', {}, (err, categories) => {
      if (err) {
         return res.status(400).json({
            error: 'Categories not found',
         });
      }
      res.json(categories);
   });
};

// list products by search
// we make api requests based on what the user needs
exports.listBySearch = (req, res) => {
   let order = req.body.order ? req.body.order : 'desc';
   let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
   let limit = req.body.limit
      ? parseInt(req.body.limit)
      : 100;
   let skip = parseInt(req.body.skip);
   let findArgs = {};

   // console.log(order, sortBy, limit, skip, req.body.filters);
   // console.log("findArgs", findArgs);

   for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
         if (key === 'price') {
            // gte -  greater than price [0-10]
            // lte - less than
            findArgs[key] = {
               $gte: req.body.filters[key][0],
               $lte: req.body.filters[key][1],
            };
         } else {
            findArgs[key] = req.body.filters[key];
         }
      }
   }

   Product.find(findArgs)
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
         if (err) {
            return res.status(400).json({
               error: 'Products not found',
            });
         }
         res.json({
            size: data.length,
            data,
         });
      });
};

// send product photo
exports.photo = (req, res, next) => {
   if (req.product.photo.data) {
      res.set(
         'Content-Type',
         req.product.photo.contentType
      );
      return res.send(req.product.photo.data);
   }
   next();
};
