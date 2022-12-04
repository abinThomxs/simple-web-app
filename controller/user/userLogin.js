const { response } = require("express")
const user = require("../../model/user")

module.exports = {



    getLogin: (req, res) => {
        if (req.session.loggedIn) {
            res.redirect('/home')
        } else {
            res.render('login')
        }

    },



    getHome: (req, res) => {
        if (req.session.loggedIn) {
            res.render('home')
        } else {
            res.redirect('/login')
        }
    },

    postHome: (req, res) => {
        const { email, password } = req.body
        user.findOne({ email: email, password: password })
            .then((result) => {
                if (result) {
                    req.session.loggedIn = true;
                    req.session.email = req.body.email
                    res.redirect('/home')
                    console.log(req.session.email);
                }
                else {
                    res.redirect('/login')
                    console.log("invalid Entry");
                }

            })
            .catch((err) => {
                console.log(err);
            })
    },

}