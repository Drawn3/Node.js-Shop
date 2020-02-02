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
    }),
    body('password','Пароль должен сожердать минимум 6 символов').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('confirm').custom((val,{req})=>{
        if(val !== req.body.password){
            throw new Error('Пароли должны совпать')
        }
        return true
    }),
    body('name').isLength({min:3}).withMessage('Имя должно содержать как минимум 3 символа')
]