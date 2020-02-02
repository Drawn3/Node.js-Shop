const {Router} = require('express');
const Course = require('../models/course')
const auth = require('../middleware/auth')
const {validationResult} = require('express-validator')
const {courseValidator} = require('../utils/validators.js')
const router = Router()

router.get('/', auth, (req, res)=>{
    res.render('add',{
        title: "Добавить курсы",
        isAdd: true
    })
})

router.post('/', auth, courseValidator, async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
            return res.status(422).render('add',{
                title: "Добавить курсы",
                isAdd: true,
                error: errors.array()[0].msg
            })
        }
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try{
        await course.save()
        res.redirect('/courses')
    }catch(e){
        console.log(e)
    }
})

module.exports = router