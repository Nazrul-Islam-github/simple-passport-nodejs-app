const LocalStarategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../model/User')

module.exports = function (passport) {
    passport.use(
        new LocalStarategy({ usernameField: 'email'}, (email, password, done) => {
            // match User
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        // if email dose not Exests
                        return done(null, false, { message: "Invalid Email or Password " })
                    }
                    // Match PAssword
                    bcrypt.compare(password, user.password, (error, isMatch) => {
                        // if an error
                        if (error) throw error;

                        if (isMatch) {
                            // if password are match
                            return done(null, user)
                        } else {
                            // if Password not match
                            return done(null, false, { message: "Invalid Email or Password " })
                        }
                    })
                })
                .catch(error => { throw error });
        })
    );





    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}