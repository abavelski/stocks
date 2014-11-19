var errors = require('../errors'),
User = require('../db/models/user'),
Transaction = require('../db/models/transaction'),
stockInfo = require('../api/finance/stockInfo'),
Promise = require('promise');



module.exports = function(router) {


  router.route('/auth/order').post(function(req, res){
    var order = req.body;

    User.findById(req.user.id).exec().then(function(user){
      var cashAccount = user.getCashAccountById(order.cashAccount._id);
      var custodyAccount = user.getCustodyAccountById(order.custody._id);

      var createTransaction = function(stocks) {     
        return new Promise(function(resolve, reject) {
          var price = (order.action=='buy')?stocks[0].ask:stocks[0].bid;
          var transaction = new Transaction({
            action : order.action,
            custodyId : order.custody._id,
            cashAccountId : order.cashAccount._id,
            symbol : order.symbol,
            type : order.orderType,
            amount : order.amount,
            price : price,
            commission : 29,
            date : new Date()
          });
          transaction.save(function(err, transaction){
            if (err) {
              reject(err);
            } else {
              resolve(transaction);
            }
          });
        });
      };

      var updateUser = function(transaction) {
        return new Promise(function(resolve, reject){
          if (transaction.action=='buy') {
            cashAccount.balance -= transaction.amount*transaction.price - transaction.commission;
          } else {
            cashAccount.balance += transaction.amount*transaction.price - transaction.commission;
          }

          var holding = null;
          custodyAccount.holdings.forEach(function(h){
            if (h.symbol==transaction.symbol) {
              holding = h;
            }
          });

          if (holding && transaction.action == 'buy') {
            holding.amount += transaction.amount;
          } else if (holding && transaction.action == 'sell') {
            holding.amount -=transaction.amount;
          } else {
            holding = {
              amount : transaction.amount,
              symbol : transaction.symbol,
              avgPurchasePrice : transaction.price
            }
            custodyAccount.holdings.push(holding);
          }
          user.save(function(err, user){
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          });
        });
      };

      var onSuccess = function() {
        res.send(201).end();
      };

      var onReject = function(err) {
        res.status(500).end();  
      };


      stockInfo
        .forSymbols([order.symbol])
        .withFields(['ask', 'bid'])
        .getStocks()
      .then(createTransaction)
      .then(updateUser)
      .then(onSuccess, onReject);
    },
    function(err) {
      res.status(401).end();
    });
});



};