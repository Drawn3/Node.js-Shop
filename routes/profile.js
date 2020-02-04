const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router();

router.get('/', auth, async (req,res) => {
    res.render('profile',{
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject(),
    })
})
router.post('/', auth, async (req,res) =>{
    try {
        const user = await User.findById(req.user._id)

        const toChange = {
            user: req.body.name
        }
        console.log(toChange)
        if(req.file){
            toChange.userAvatar = req.file.path
        }

        Object.assign(user, toChange)

        await user.save()

        res.redirect('/profile')
    } catch (error) {
        console.log(error)
    }
})
module.exports = router