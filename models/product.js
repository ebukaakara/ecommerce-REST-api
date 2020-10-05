const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
         maxlength: 30,
      },
      description: {
         type: String,
         required: true,
         maxlength: 1500,
      },
      price: {
         type: Number,
         required: true,
         trim: true,
         maxlength: 30,
      },
      quantity: {
         type: Number,
         required: true,
      },
      sold: {
         type: Number,
         default: 0,
      },
      category: {
         type: ObjectId,
         required: true,
         ref: 'Category',
      },
      photo: {
         data: Buffer,
         contentType: String,
      },
      shipping: {
         type: Boolean,
         required: false,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
