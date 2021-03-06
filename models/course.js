const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    img: String,
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

course.method('toCLient', function () {
    const course = this.toObject()
    console.log(course)
    course.id = course._id
    delete course._id
    return course
})
module.exports = model('Course', course)