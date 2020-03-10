const {Router} = require('express');
const router = Router()

router.get('/', async (req, res) => {

    res.render('index',{
        title: 'Добро пожаловать',
        isHome: true,
        userName: req.user ? req.user.name.charAt(0).toUpperCase() + req.user.name.slice(1) : null 
        
    })
})

module.exports = router