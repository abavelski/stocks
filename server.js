#!/bin/env node
var express = require('express'),
config = require('./config'),
app = express(),
morgan  = require('morgan'),
bodyParser = require('body-parser'),
expressJwt = require('express-jwt'),
mongoose = require('mongoose'),
companies = require('./routes/companies'),
users = require('./routes/users'),
main = require('./routes/main'),
orders = require('./routes/orders'),
custodies = require('./routes/custodies');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('short'))
  .use(express.static(config.staticFolder))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded())
  .use('/auth', expressJwt({secret: config.secret}))

//mongoose.connect(config.mongoUrl);
var url = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
console.log(url);
mongoose.connect(url);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  
  var router = express.Router(); 

  main(router);
  users(router);
  companies(router);
  orders(router);
  custodies(router);

  app.use('/', router);
  app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8000);
  console.log('Server started...');
});

