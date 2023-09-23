const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    // res.send('hello');
    res.render('users/register');
}

module.exports.register = async (req, res, next)=>{
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp camp!');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res)=>{
    // res.send('welcome');
    res.render('users/login');
}

module.exports.login = (req, res)=>{
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', 'Welcome Back');
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}