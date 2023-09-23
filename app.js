if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express= require('express');
const app= express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const RouteUser = require('./routes/users');
const RouteCampground = require('./routes/campgrounds');
const RouteReviews = require('./routes/reviews');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');
const helmet = require('helmet');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log('Database Connected');
})
.catch(e=>{
    console.log('Connection error');
    console.log(e);
})

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'TopSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpsOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({
    contentSecurityPolicy: false
}));



app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next)=>{
    // console.log(req.flash('success'))
    // console.log(req.user)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')[0]
    res.locals.error = req.flash('error')[0]
    next()
})

app.get('/fakeUser', async (req, res)=>{
    const user = new User({email: 'ompirakash2001@gmail.com', username: 'ompiii'});
    const newUser = await User.register(user, 'monkey');
    res.send(newUser);
})

app.use('/', RouteUser);
app.use('/campgrounds', RouteCampground);
app.use('/campgrounds/:id/reviews', RouteReviews);


app.get('/', (req, res)=>{
    res.render('home')
})

app.all('*',(req, res, next) => {
    next(new ExpressError('page Not Found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode=500, message='something went wrong'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });
})
app.listen(3000, ()=>{
    console.log("serving on PORT 3000");
})