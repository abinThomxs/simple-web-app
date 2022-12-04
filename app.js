const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const morgan = require('morgan')
const user = require('./models/user');
const { db } = require('./models/user');
const app = express();
const PORT = 4000;



app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());


var message = ""
const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "thisismysecretkeygjkgyuk67rtf69",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));


var session;

app.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    );
    next()
})


app.post('/signup', (req, res) => {
    message = "";
    if (req.body.password === req.body.confirmPassword) {
        var userid = new user({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        userid.save((err, docs) => {
            if (err) {
                console.log(err
                )
                res.redirect('/signup')
            }
            else {
                console.log(docs)
                req.session.loggedIn = true
                res.redirect('/login')
            }
        })
    }
    else {
        message = "password do not match";
        res.redirect("/signup");

    }

})

app.get('/login', (req, res) => {
    session = req.session;
    if (session.loggedIn) {
        res.redirect('/home');
    } else {
        res.render('login', { message });
    }
});

const msg = 'Invalid userID or password'

    ;

app.get('/signup', (req, res) => {
    res.render('signup', { message })
})




app.get('/home', (req, res) => {
    session = req.session;
    if (session.loggedIn) {
        res.render('home');
    } else {
        res.redirect('/login');
    }
})


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    user.findOne({ email: email, password: password })
        .then((result) => {
            if (result) {
                console.log(result)
                req.session.loggedIn = true;
                req.session.email = result.email

                res.redirect("/home");
                console.log(req.session.email)
            } else {
                message = "Invalid Email or Password";
                res.redirect("/login");
            }
        })
        .catch((err) => {
            console.log(err);
        });
})


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});



app.get('/adminlogin', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/admin')
    } else {
        res.render('adminLogin')
    }
})




app.get('/admin', async (req, res) => {

    if (req.session.admin) {
        const usersData = await user.find()
        res.render('table', { users: usersData })
    } else {
        res.redirect('/adminlogin')
    }
})



const myemail = 'admin@123';
const mypassword = '123';

app.post('/adminlogin', (req, res) => {
    if (req.body.email === myemail && req.body.password === mypassword) {
        req.session.admin = req.body.email
        req.session.loggedIn = true
        res.redirect('/admin')
    } else {
        res.redirect('/adminlogin')
    }
})

app.get('/adduser', (req, res) => {
    try {
        res.render('newuser')
    } catch (error) {
        console.log(error.message);
    }
})

app.post('/adduser', async (req, res) => {
    try {

        console.log(req.body)
        const { firstName, lastName, email, password } = req.body

        const userID = new user({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password

        })
        const userData = await userID.save()
        if (userData) {
            res.redirect('/admin')
        } else {
            res.render('newuser')
        }

    } catch (error) {
        console.log(error.message);
    }
})


app.get('/edituser', async (req, res) => {
    try {
        const id = req.query.email
        const userData = await user.findOne({ email: id })
        if (userData) {
            res.render('edituser', { user: userData })
        }
        else {
            res.redirect('/admin')
        }

    } catch (error) {
        console.log(error.message);

    }
})

app.post('/edituser', async (req, res) => {
    try {

        console.log(req.body)
        const { firstname, lastname, email, password } = req.body        
        const userData = await user.updateOne({ email: email }, {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password

        })
        if (userData) {
            res.redirect('/admin')
        } else {
            res.render('edituser')
        }

    } catch (error) {
        console.log(error.message);
    }
})




app.get('/deleteuser', async (req, res) => {
    try {
        const id = req.query.email
        await user.deleteOne({ email: id })
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message);

    }
})


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));



