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
const helmet = require('helmet')
//save user sessions in mongodb for protected
const MongoDBStore = require('connect-mongodb-session')(session);

//handling mistakes//
const flash = require('connect-flash')

//compression static files//
const compression = require('compression')

//Own middleware//
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const mistakeRoutes = require('./middleware/404')
const fileMiddleware = require('./middleware/file')

//keys best practise with global variables//
const keys = require('./keys')

//init express//
const app = express()

//Create hbs extension and layout middleware//
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
})

//Install hbs.engine middleware///
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

//mongodb Sessions collections//
const store = new MongoDBStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})

//puplic folder for static files//
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

//init middlewares//
app.use(fileMiddleware.single('avatar'))
//protected post request//
app.use(csrf())
//global erorrs collections//
app.use(flash())
//protected headers for prod//
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

//init routes//
app.use('/', require('./routes/home'))
app.use('/add', require('./routes/add'))
app.use('/courses', require('./routes/courses'))
app.use('/card', require('./routes/card'))
app.use('/orders',require('./routes/orders'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))

//404 routes always do in the end of routes//
app.use(mistakeRoutes)

//options for mongoDB//
const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
}

///Function to connect db///
async function start(){
    try{
        await mongoose.connect(keys.MONGODB_URI, options)
        app.listen(keys.PORT, () => {
            console.log(` server is running on port ${keys.PORT}`)
        })    
    }catch(e){
        console.log(e)
    }
}

start()




