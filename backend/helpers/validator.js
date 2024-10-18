import { check } from 'express-validator';

export const registerValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
];

export const loginValidator = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Password is required').not().isEmpty(),
];

export const logoutValidator = [
    check('token', 'Token is required for logout').not().isEmpty(),
];

export const forgotPasswordValidator = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
];

export const resetPasswordValidator = [
    check('token')
        .notEmpty()
        .withMessage('Token is required'),
    check('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

