const multer = require('multer')

//where and how to upload file//
const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null, 'images/')
    },
    filename(req,file,cb){
        cb(null,  Date.now() + '-' + file.originalname) 
    }
})
//filter files//
const allowedType = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req,file,cb) => {
    if(allowedType.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

module.exports = multer({
    storage,fileFilter
})