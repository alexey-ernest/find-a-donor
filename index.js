var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var errors = require('./lib/routes/errors');
var routes = require('./lib/routes');

var app = express();

// CORS
app.use(cors({ allowedHeaders: 'Authorization, Content-Type' }));

// logger
if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger());
}

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static
app.use('/', express.static(path.join(__dirname, 'build')));

// routes
app.use('/', routes);

// error handlers
app.use(errors.notfound);
app.use(errors.error);

module.exports = app;
