const express = require('express');
const router = express.Router();
const User = require('../model/User')
const bcrypt = require('bcryptjs');
const passport = require('passport')


const saltRound = 12;

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
});

// register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let error = [];

    // ---check require fildes
    if (!name || !email || !password || !password2) {
        error.push({ massage: "please fill in all fields" })
    }


    // check password match 
    if (password2 !== password) {
        error.push({ massage: "Password do not match" })
    }

    // password length check
    if (password.length < 6) {
        error.push({ massage: "password shoud be at least 6 characters" })
    }

    if (error.length > 0) {
        res.render('register', {
            error: error,
            name: name
            , email: email
            , password: password
            , password2: password2
        })
    }
    else {
        //    validation pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // user exists
                    error.push({ massage: "This email is already exists" })
                    res.render('register', {
                        error: error,
                        name: name
                        , email: email
                        , password: password
                        , password2: password2
                    })

                }
                else {
                    // new User 
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: password
                    });
                    // Hash Password
                    bcrypt.genSalt(saltRound, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) throw error;
                            // set password hash
                            newUser.password = hash;
                            // save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in'
                                    );
                                    res.redirect('/users/login');

                                })
                                .catch(error => console.log(error))
                        })



                    })

                }
            })
    }
});

// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'you are logout');
    res.redirect('/users/login');
});

module.exports = router;