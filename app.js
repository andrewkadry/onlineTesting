var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var fileUpload = require('express-fileupload');
var mailer = require('express-mailer');

var indexRouter = require('./routes/index');
var candidateRouter = require('./routes/candidates');
var examRouter = require('./routes/exams');
var topicRouter = require('./routes/topics');
var positionRouter = require('./routes/positions');
var questionRouter = require('./routes/questions');

var app = express();

// create connection to database
var db = mysql.createConnection ({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7270623',
  password: 'YxNshyjAIZ',
  database: 'sql7270623',
  multipleStatements: true
});

// connect to database
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});
global.db = db;

mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user: '100ahmedayman001@gmail.com',
    pass: 'ahmedayman111998'
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/candidates', candidateRouter);
app.use('/exams', examRouter);
app.use('/topics', topicRouter);
app.use('/positions', positionRouter);
app.use('/questions', questionRouter);

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
