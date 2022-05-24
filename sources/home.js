const session = require('express-session');
const express = require('express');
var bcrypt = require('bcrypt');
const client = require('../public/javascripts/databaspg');
const misc = require('../public/javascripts/misc');
var app = module.exports = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'open source panel',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

app.get('/home', (req, res) => {
    try {
        if (!req.session.logged_in) {
            return res.redirect('/login'); // redirect to the login page
        }
    }
    catch(e){

    }


    res.render('home.ejs');
});

app.post('/home', async (req, res) => {
    if (!req.session.logged_in) {
        return res.redirect('/login');
    }
});


