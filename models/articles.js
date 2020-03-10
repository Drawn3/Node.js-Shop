const {Schema,model}  = require('mongoose')


const articles = new Schema({
    title: {
        type: String,
        required: true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    articlesText: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
})



module.exports = model('Articles', articles)