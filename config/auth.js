module.exports = {
    ensureAuthenticate: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'please login to view the resource');
            res.redirect('/users/login');
        }
    }
}