const session = require('express-session');
const express = require('express');
var app = module.exports = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.render('index.ejs');
});