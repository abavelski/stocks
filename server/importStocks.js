'use strict';
var csv = require('csv'),
    stockInfo = require('./api/finance/stockInfo');

var symbols = [];
csv().from.path('stocks.csv').to.array(function(stocks) {

    var res = stocks.map(function(stock) {
        var s = {
            name : stock[0],
            symbol: stock[1].replace(' ', '-')+'.CO',
            currency: stock[2],
            isin : stock[3],
            sector: stock[4]
        };
        if (symbols.length<200) {
            symbols.push(s.symbol);
            }
    return s;
    });
console.log(res);
    /*stockInfo
        .forSymbols(symbols)
        .withFields(['name', 'lastTradePrice'])
        .getStocks()
        .then(function(stocks) {
            console.log(stocks);
        },
        function(err) {
            console.log(err);
        });*/
});