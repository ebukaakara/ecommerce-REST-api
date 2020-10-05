exports.userSignupValidator = (req, res, next) => {
   req.check('name', 'Name is required').notEmpty();
   req.check('password', 'Password is required').notEmpty();
   req.check('password')
      .isLength({ min: 6 })
      .withMessage(
         'Password must contain at least six characters'
      )
      .matches(/\d/)
      .withMessage('Password must contain a number');
   req.check('email', 'Email must be valid')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage('Please input a valid email address');

   const errors = req.validationErrors();

   if (errors) {
      const firstErrors = errors.map(
         (error) => error.msg
      )[0];
      return res.status(400).json({ error: firstErrors });
   }
   next();
};
