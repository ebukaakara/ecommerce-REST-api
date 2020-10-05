const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
         maxlength: 20,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      hashed_password: {
         type: String,
         required: true,
      },
      about: {
         type: String,
         required: true,
      },
      salt: {
         type: String,
      },
      role: {
         type: Number,
         default: 0,
      },
      history: {
         type: Array,
         default: '',
      },
   },
   { timestamps: true }
);

// Mongoose Virtual Fields
userSchema
   .virtual('password')
   .set(function (password) {
      this._password = password;
      this.salt = uuidv4();
      this.hashed_password = this.encrypt(password);
   })
   .get(function () {
      return this._password;
   });

userSchema.methods = {
   // Create auth method
   authenticate: function (plainText) {
      return (
         this.encrypt(plainText) === this.hashed_password
      );
   },

   // encrypt password
   encrypt: function (password) {
      if (!password) {
         return '';
      }
      try {
         return crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
      } catch (err) {
         return '';
      }
   },
};

module.exports = mongoose.model('User', userSchema);
