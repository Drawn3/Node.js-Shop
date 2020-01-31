//libraries//
const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
//frontend views//
const exphbs = require('express-handlebars')
//working free with session user//
const session = require('express-session')
//security routes//
const csrf = require('csurf')
//save user sessions in mongo db for protected
const MongoDBStore = require('connect-mongodb-session')(session);
//handling mistakes//
const flash = require('connect-flash')

//web-applications routes//
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

//Own middleware/
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

//keys best practise with global variables//
const keys = require('./keys')


//init express//
const app = express()

//Create hbs extension and layout middleware//
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

//Install hbs.engine middleware///
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

//mongodb Sessions//
const store = new MongoDBStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})

//puplic folder for static files//
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

//init middlewares//
app.use(csrf())


app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses',coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders',ordersRoutes)
app.use('/auth', authRoutes)

//global port//
const PORT = process.env.PORT || 4000

///Function to connect db///
async function start(){
    try{
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => {
            console.log(` server is running on port ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}

start()




