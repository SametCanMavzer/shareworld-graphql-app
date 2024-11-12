const { body } = require('express-validator');
const User = require('../models/user');

exports.createPostValidator = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Başlık 5-100 karakter arasında olmalıdır'),
    body('content')
        .trim()
        .isLength({ min: 10 })
        .withMessage('İçerik en az 10 karakter olmalıdır')
        .escape(),
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Geçerli bir URL giriniz')
];

exports.updatePostValidator = [
    body('title')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Başlık en az 5 karakter olmalıdır'),
    body('content')
        .trim()
        .isLength({ min: 5 })
        .withMessage('İçerik en az 5 karakter olmalıdır')
];

exports.signupValidator = [
    body('email')
        .isEmail()
        .withMessage('Geçerli bir e-posta adresi giriniz')
        .custom(async (value) => {
            const userDoc = await User.findOne({ email: value });
            if (userDoc) {
                return Promise.reject('Bu e-posta adresi zaten kullanılıyor!');
            }
        })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Şifre en az 6 karakter olmalıdır'),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('İsim alanı boş bırakılamaz')
];

exports.loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Geçerli bir e-posta adresi giriniz')
        .normalizeEmail(),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Şifre gereklidir')
];


