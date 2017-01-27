if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const api = require('./routes/api');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../dist')));

// define routes
app.use('/api', api);

// catch 404 and forward to angular2
app.use((req, res) => {
  console.log(`Redirecting Server 404 request: ${req.originalUrl}`);
  res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // only providing error details in development
  err = process.env.NODE_ENV === 'development' || 'test'
    ? { message: err.message, stack: err.stack }
    : { message: err.message };

  // send error json
  res.json({ err: err });
});

module.exports = app;
