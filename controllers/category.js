const Category = require('../models/category');
const {
   errorHandler,
} = require('../helpers/dbErrorHandler');

// id a category
exports.categoryById = (req, res, next, id) => {
   Category.findById(id).exec((err, category) => {
      if (err || !category) {
         return res.status(400).json({
            error: 'Category does not exist',
         });
      }
      req.category = category;
      next();
   });
};

// create a category
exports.create = (req, res) => {
   const category = new Category(req.body);
   category.save((err, data) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      res.json({ data });
   });
};

// read all category
exports.read = (req, res) => {
   return res.json(req.category);
};

// update a category
exports.update = (req, res) => {
   const category = req.category;
   category.name = req.body.name;
   category.save((err, data) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      res.json(data);
   });
};

// remove a category
exports.remove = (req, res) => {
   const category = req.category;
   category.remove((err, data) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      res.json({
         message: 'Category successfully deleted',
      });
   });
};

// get all the categories
exports.list = (req, res) => {
   Category.find().exec((err, data) => {
      if (err) {
         return res.status(400).json({
            error: errorHandler(err),
         });
      }
      res.json(data);
   });
};
