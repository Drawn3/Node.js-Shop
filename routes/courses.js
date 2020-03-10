const {Router} = require('express');
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

//function protected delete and edit//
function ownerCourse(course,req){
    return course.userId.toString() === req.user._id.toString()
}

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
       
        if(!ownerCourse(course,req)){
            return res.redirect('/courses')
        } 
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
         await Course.deleteOne({
             _id: req.body.id,
             userId: req.user._id
            })
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
        const course = await Course.findById(id)
        
        if(!ownerCourse(course,req)){
            return res.redirect('/courses')
        }
        Object.assign(course,req.body)
        await course.save()
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