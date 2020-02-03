const {body} = require('express-validator')
const User = require('../models/user')

exports.registrationValidator = [
    body('email','Введите корректный email').isEmail().custom( async (value, {req})=>{
        try {
            const user = await User.findOne({email: value})
            if(user){
                return Promise.reject('Такой Email уже занят')
            }
        } catch (error) {
            console.log(error)
        }
    })
    .normalizeEmail(),

    body('password','Пароль должен сожердать минимум 6 символов')
    .isLength({min: 6, max: 56})
    .isAlphanumeric().
    trim(),

    body('confirm').custom((val,{req})=>{
        if(val !== req.body.password){
            throw new Error('Пароли должны совпать')
        }
        return true
    })
    .trim(),

    body('name').isLength({min:3}).withMessage('Имя должно содержать как минимум 3 символа').trim()
]

// exports.loginValidator = [
//     body('email','Email не зарегестрирован').isEmail().custom( async (value, {req})=>{
//         try {
//             const user = await User.findOne({email: value})
//             if(user){
//                 return Promise.reject('Такой Email не зарегистрован')
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     })
// ]

exports.courseValidator = [
    body('title')
        .isLength({min: 3})
        .withMessage('Минимальная длина названия курса 3 символа')
        .trim(),

    body('price')
        .isNumeric()
        .withMessage('Введите корректную цену'),

    body('img','Введите корректный URL картинки').isURL()
]