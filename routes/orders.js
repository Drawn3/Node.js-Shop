const {Router} = require('express') 
const Orders = require('../models/orders')
const auth = require('../middleware/auth')
const router = Router()

router.get('/' , auth, async (req, res) => {
    try{
        const orders  = await Orders.find({
            'user.userId': req.user._id
        })
        .populate('user.userId')
        res.render('orders',{
            isOrders: true,
            title: 'Заказы',
            orders: orders.map(item => {
                return {
                    ...item._doc,
                    price: item.courses.reduce((total, o)=>{
                        return total += o.count * o.course.price
                    },0)
                }
            })
        })
    }catch(e){
        console.log(e)
    }
})
router.post('/' , auth, async (req, res) => {
    try{
        const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()
        const courses = user.cart.items.map(item => ({
            count: item.count,
            course: {...item.courseId._doc}
        }))
        const order = new Orders({
            user: {
                name: req.user.name,
                userId: req.user,
            },
            courses: courses,
        })
        await order.save()
        await req.user.clearCart()
    
        res.status(200).redirect('/orders')
    }catch(e){
        console.log(e)
    }
})
router.post('/delete' , auth, async (req, res) => {
    res.status(200).redirect('/')
})

module.exports = router