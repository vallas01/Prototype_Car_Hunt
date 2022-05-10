const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/models');

const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler } = require('./utils.js');
// } = require('../auth')
const router = express.Router();


const postValidators = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for First Name')
        .isLength({ max: 50 })
        .withMessage('First Name must not be more than 50 characters long'),
    check('model')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Last Name')
        .isLength({ max: 50 })
        .withMessage('Last Name must not be more than 50 characters long'),
    check('make')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email')
        .isLength({ max: 255 })
        .withMessage('Email must not be more than 255 characters long'),
    check('year')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password should contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    check('color')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Confirm Password')
  ];
  
//   const postValidators = [
//     check('email')
//       .exists({ checkFalsy: true })
//       .withMessage('Please provide a value for Email Address'),
//     check('password')
//       .exists({ checkFalsy: true })
//       .withMessage('Please provide a value for Password'),
//   ];

router.get("/new", asyncHandler(async(req, res) => {
    const {
        name,
        model,
        make,
        year,
        color,
        accidents,
        features,
        description
      } = req.body
    
      const user = db.Post.build({
        name,
        model,
        make,
        year,
        color,
        accidents,
        features,
        description,
        ownerId 
      });
    
      const validatorErrors = validationResult(req);
    
      if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 12)
        user.hashedPassword = hashedPassword;
        await user.save();
        loginUser(req, res, user);
        res.redirect('/');
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('user-register', {
            title: 'Register',
            user,
            errors,
            csrfToken: req.csrfToken()
        })
      }
}))