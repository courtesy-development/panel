const session = require('express-session');
const speakeasy = require("speakeasy");
const express = require('express');
const bcrypt = require('bcrypt');
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

app.get('/login', (req, res) => {
    try {
        if (req.session.logged_in) {
            return res.redirect('/home'); // redirect to the home page
        }

        res.render('login.ejs')
    }
    catch(e) {
        console.log(e);
    }
});

app.post('/login', async (req, res) => {

    try {
        if (req.session.logged_in) {
            return res.redirect('/home'); // redirect to the home page
        }

        const username = req.body.name;
        const password = req.body.password;

        if (username == '' || password == '') {
           console.error('empty fields');
            return res.render('login.ejs', {
                username: username,
                password: password
            });
        }

        var rows = await client.get_user_data_username(username);
        if (rows.length === 0) {
            console.error(" %s Is not in database", req.body.name);
            return res.render('login.ejs',{
                username: username,
                password: password
            });
        }

        const data = rows[0];
        if (!(await bcrypt.compare(password + data.registered_on, data.password_hash))) {
            console.error(`Invalid password by: ${username} on site`);
            return res.render('login.ejs',{
                username: username,
                password: password
            });
        }

        const ip_address = misc.get_ip(req);
        await client.update_login_information(username, ip_address, misc.time_ms());

        req.session.logged_in = true;
        req.session.user_id = data.uid;
        req.session.username = username;

        return res.redirect('/home');
    }
    catch (e) {
        console.log(e);
        return res.render('login.ejs');
    }
});