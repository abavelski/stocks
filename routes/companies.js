var stockInfo = require("../api/finance/stockInfo");
var lookup = require("../api/finance/lookup");
var history = require("../api/finance/stockHistory");
var config = require("../config");

module.exports = function(router) {
   
router.route('/api/companies').get(function(req, res) {
	stockInfo.forSymbols(config.symbols)
		.withFields(config.fields.companies)
		.getStocks()
		.then(
			function(data){
				res.json(data);
			},
			function(err) {
				res.send(500).end();
			});
});

router.route('/api/companies/:symbol').get(function(req, res){
	stockInfo.forSymbols([req.params.symbol])
		.withFields(config.fields.details)
		.getStocks()
		.then(function(data){
				res.json(data[0]);
			},
			function() {
				res.send(500).end();
			});
});

router.route('/api/companies/lookup/:query').get(function(req, res){
	lookup(req.params.query, function(data){
		res.json(data);
	});
});

router.route('/api/companies/history/:symbol').get(function(req, res) {
	var startDate = new Date();
	startDate.setFullYear(startDate.getFullYear()-1);

	history.forSymbol(req.params.symbol)
		.from(startDate).to(new Date()).getHistory(function(data){
		res.json(data);
	})
});

};