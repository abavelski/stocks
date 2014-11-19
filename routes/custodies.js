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

module.exports = function(router) {

	router.route('/auth/custodies/:id').get(function(req, res){
		User.findById(req.user.id).exec().then(function(user){
			if (req.params.id=='ALL') {
				res.json(buildAllCustody(user.custodyAccounts));
				return;
			}


			var custody = user.getCustodyAccountById(req.params.id);
			res.json(custody.holdings);
		}, function(err){
			res.send(500).end();
		});
	});

}