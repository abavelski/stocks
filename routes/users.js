var errors = require('../errors'),
  User = require('../db/models/user'),
  Transaction = require('../db/models/transaction'),
  config = require('../config'),
  stockInfo = require('../api/finance/stockInfo');

module.exports = function(router) {

//login
router.route('/api/login').post(function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json(401, {error: errors.loginFailed });
    return;
  }

  User.findOne({'login': req.body.username}).exec().then(function(user){
      if (user && user.checkPassword(req.body.password)) {
        res.json({ token: user.getToken(), user: user.prepareForTransfer() });
      } else {
        res.json(401,{error: errors.loginFailed });
      }      
  },  function(err) {
      res.json(401,{error: errors.loginFailed });
  });
});

//register new user
router.route('/api/register').post(function(req, res){
  var user = new User({
    login : req.body.email,
    password : req.body.password,
    custodyAccounts : [config.defaultCustody],
    cashAccounts : [config.defaultCashAccount]
  });
  user.save(function(err){
    if (err) {
      res.json(500, {error: errors.saveUserFailed});
    } else {      
      res.json(201);
    }
  });
});

//add new custody
router.route('/auth/custody').post(function(req, res){
  if (req.body.name) {
    User.addCustody(req.user.id, {name : req.body.name }, function(err, custody){
      if (err) {
        res.json(500, {error : errors.saveCustodyFailed});
      } else {
        res.json(201, custody);
      }
    });
  } else {
    res.json(503, {error : errors.saveCustodyFailed});
  }
});

//instruments
router.route('/auth/instruments').get(function(req, res){
  User.findById(req.user.id).exec().then(function(user){
      var symbols = user.getAllSymbols();
      console.log('symbols:',symbols);
      stockInfo
        .forSymbols(symbols)
        .withFields(['symbol', 'name', 'lastTradePrice'])
        .getStocks()
        .then(function(stocks) {
          console.log(stocks);
          result = {};
          for (var i = 0; i<stocks.length; i++) {
            stocks[i].lastTradePrice = Number(stocks[i].lastTradePrice);
            result[stocks[i].symbol] = stocks[i];
          }
          res.json(result);
        },
          function(err) {
            res.send(500).end();
          });
    }, function(err){
      res.send(500).end();
    });

});

//add new cash account
router.route('/auth/cash-account').post(function(req, res){
  if (!req.body.name || !req.body.currency) {
    res.json(503, {error : errors.saveCashAccountFailed});
    return;
  } 
  User.addCashAccount(req.user.id, { 
    name : req.body.name, 
    currency : req.body.currency, 
    balance : 0 
  }, function(err, cashAccount){
      if (err) {
        res.json(500, {error : errors.saveCashAccountFailed});
      } else {
        res.json(201, cashAccount);
      }
    });
});



};