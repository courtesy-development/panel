const session = require('express-session');
const express = require('express')
var bcrypt = require('bcrypt');
const client = require('../public/javascripts/databaspg');
const misc = require('../public/javascripts/misc');
var app = module.exports = express()

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'open source panel',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

app.get('/register', (req, res) => {
    try {
        if (req.session.logged_in) {
            return res.redirect('/home'); // redirect to the home page
        }
        res.render('register.ejs')
    }
    catch(e) {
        console.log(e);
        res.render('error500.ejs')
    }
});

app.post('/register', async (req, res) => {
    try {
        if (req.body === undefined || req.body.name === undefined || req.body.password === undefined || req.body.password_confirmation === undefined || req.body.email === undefined) {
            return res.redirect('/register');
        }

        if (req.body.name === '' || req.body.password === '' || req.body.password_confirmation === '' || req.body.email === '') {
            console.error(" %s tried to register Did not fill all fields", req.body.name);
            return res.render('register.ejs', {
                username: req.body.username,
            });
        }

        const ip_address = misc.get_ip(req);
        var username = req.body.name;
        var password = req.body.password;
        var confirmation = req.body.password_confirmation;
        var email = req.body.email;

        if (password !== confirmation) {
            console.error(" %s tried to register Passwords do not match", req.body.name);
            return res.render('register.ejs', {
                username: req.body.username,
            });
        }

        if (await client.is_username_taken(username).length > 0) {
            return res.render('register.ejs', {
                username: req.body.username,
            });
        }

        if (await client.is_email_taken(username).length > 0) {
            return res.render('register.ejs', {
                username: req.body.username,
            });
        }

        const registered_time = misc.time_ms();
        var hashed_password = await bcrypt.hash(password + registered_time, 10);
        if (await client.register_new_user(username, email, hashed_password, registered_time, ip_address)) {
            console.info("%s Registered! With IP: %s", username,ip_address )
            return res.render('login.ejs', {
                username: req.body.username,
            });
        }
        else {
            console.log("Failed to register");
            return res.render('register.ejs', {
                username: req.body.username,
            });
        }
    } catch(e) {
        res.redirect('/register');
        console.log(e);
    }
});