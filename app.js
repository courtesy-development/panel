var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/discord', (req, res) => {
  res.redirect('https://discord.gg/X8hAZTZmDw');
});

const register = require('./sources/register');
const login = require('./sources/login');
const home = require('./sources/home');


app.use(register);
app.use(login);
app.use(home);

// Redirect instead of rendering new page?
const index = require('./sources/index');
app.use(index);
/* Redirect?
app.get('/', (req, res) => {
    return res.redirect('/login');
});
*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
