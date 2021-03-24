// --Import Modules
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);

// ---Connections Database
require('./db/connection');
// ---model 
const user = require('./model/User');

const PORT = process.env.PORT || 3000;
const app = express();

// Static File
const static_file = path.join(__dirname, './public');
app.use(express.static(static_file));


// EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

// Bodyperser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// passport midleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    console.log(res.locals.success_msg);
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error_login = req.flash('error');
    console.log(res.locals.error_login);
    next();
});


// -------Router
app.use('/', require('./route/index'));
app.use('/users', require('./route/user'));

// -------Start Server-
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});

