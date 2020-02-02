const {Router} = require('express');
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

//get all courses//
router.get('/',  async (req, res)=>{
    try{
        const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img');
        
            res.render('courses',{
                title: "Курсы",
                isCourses: true,
                userId: req.user ? req.user._id.toString() : null,
                courses
        
            })
    }catch(e){
        console.log(e)
    }
})

//edit one course//
router.get("/:id/edit", auth, async (req,res)=>{
    if(!req.query.allow){
        return  res.redirect('/')
    }
    try{
        const course = await Course.findById(req.params.id)   
        res.render('course-edit',{
            title: `Редактировать ${course.title}`,
            course
        })
    }catch(e){
        console.log(e)
    }
})

//delete one course//
router.post("/remove", auth, async (req,res)=>{
    try{
         await Course.deleteOne({_id: req.body.id})
         res.redirect('/courses')
    }catch(e){
        console.log(e)
    }
})

//update one course//
router.post('/edit', auth, async (req,res)=>{
    try{
        const {id} = req.body
        delete req.body.id
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    }catch(e){
        console.log(e)
    }
})      
//render one course by id//
router.get("/:id", async (req,res)=>{
    try{
        const course = await Course.findById(req.params.id)
        res.render('course',{
            title: `Курс `,
            course
        })
    }catch(e){
        console.log(e)
    }
  
})

module.exports = router