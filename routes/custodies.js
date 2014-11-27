var errors = require('../errors'),
User = require('../db/models/user'),
stockInfo = require('../api/finance/stockInfo');

var buildAllCustody = function(custodies) {
	if (!custodies || custodies.length==0) {
		return null;
	}

	var custody = {
		addHolding : function(holding) {
			if (this[holding.symbol]) {
				this[holding.symbol].amount+=holding.amount;
				this[holding.symbol].avgPurchasePrice=holding.avgPurchasePrice;
			} else {
				this[holding.symbol]=holding;
			}
		}
	};
	
	custodies.forEach(function(c) {
		c.holdings.forEach(function(h) {
			custody.addHolding(h);
		});
	});
	var holdings = [];
	for (var k in custody) {
    	if (custody.hasOwnProperty(k) && typeof custody[k] !== 'function') {
        	holdings.push(custody[k]);
    	}
	}

	return holdings;

};

var getSymbolsFromHoldings = function(holdings) {
	var symbols = [];
	for (var i =0; i<holdings.length; i++) {
		symbols.push(holdings[i].symbol);
	}
	return symbols;
};


module.exports = function(router) {

	router.route('/auth/custodies/:id').get(function(req, res){
		User.findById(req.user.id).exec().then(function(user){
			var holdings = [];
			if (req.params.id=='ALL') {
				var holdings = buildAllCustody(user.custodyAccounts);
			} else {
				holdings = user.getCustodyAccountById(req.params.id).holdings;
			}

			var symbols = getSymbolsFromHoldings(holdings);

			stockInfo
        		.forSymbols(symbols)
        		.withFields(['symbol', 'name', 'lastTradePrice'])
        		.getStocks()
        		.then(function(stocks) {
          			var map = {};
          			var result = [];
          			for (var i = 0; i<stocks.length; i++) {
            			stocks[i].lastTradePrice = Number(stocks[i].lastTradePrice);
            			map[stocks[i].symbol] = stocks[i];
          			};
          			for (i=0; i<holdings.length; i++) {
          				result.push({
          					symbol : holdings[i].symbol,
          					amount : holdings[i].amount,
          					avgPurchasePrice : holdings[i].avgPurchasePrice,
          					last : map[holdings[i].symbol].lastTradePrice,
          					name : map[holdings[i].symbol].name
          				});
          			};
          			res.json(result);
           		},
          		function(err) {
            		res.send(500).end();
          		});
		}, function(err){
			res.send(500).end();
		});
	});

}