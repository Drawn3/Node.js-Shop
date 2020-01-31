const {Router} = require ('express');
const User = require('../models/user')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const resetEmail = require('../email/reset')
const regEmails = require('../email/registration')
const bcrypt = require('bcryptjs')
const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
    auth:{api_key: keys.SEND_GRID_APIKEYS}
}))

router.get('/login' , async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginErorr: req.flash('loginErorr'),
        registrationError: req.flash('registrationError')
    })
})
router.get('/logout', async (req,res) => {
    req.session.destroy(()=>{
        res.redirect('/auth/login')
    })
})
router.post('/registration' , async (req, res) => {
    try{
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            req.flash('registrationError', 'Такой Email, уже существует')
            res.redirect('/auth/login/#registration')
        }else{
            const passCrypt = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                name,
                password: passCrypt,
                cart:{
                    items:[]
                }
            })
            
            await user.save()
            await transporter.sendMail(regEmails(email,name))
            res.redirect('/auth/login')
        }
    }catch(e){
        console.log(e)
    }
})
router.post('/login' , async (req, res) => {
    try{
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            const passCheck = await bcrypt.compare(password, candidate.password)
            if(passCheck){
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if(err){
                        throw err
                    }
                    res.redirect('/')
                })
            }
        }else{
            req.flash('loginErorr', 'Пароль или email введины не правильно')
            res.redirect('/auth/login')
        }
    }catch(e){
        console.log(e)
    }
})


router.get('/reset', (req,res)=>{
    res.render('auth/reset',{
        title: 'Забыли пароль',
        error: req.flash('error')
    })
})
//new password methods//
router.post('/reset', (req,res)=>{
    try {
        crypto.randomBytes(32, async (err, buffer)=>{
            if(err){
                req.flash('error', 'Что-то пошло не так. Повторите попытку позже')
                res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')

            const candidate = await User.findOne({email: req.body.email})

            if(candidate){
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 100
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email,token))
                res.redirect('/auth/login')
            }else{
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e)
    }
})
module.exports = router