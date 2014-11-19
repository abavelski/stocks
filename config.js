"use strict";

module.exports = {
    staticFolder: __dirname+ 'dist/',
    secret : 'thisisasecret',
    mongoUrl : 'mongodb://192.168.1.192/mongoose',
    defaultCustody : {
      name: "My Custody"
    },
    defaultCashAccount : {
    	name : "My DKK cash account",
    	currency : "DKK",
    	balance : "100000"
    },
    symbols : ['NOVO-B.CO', 'MAERSK-A.CO', 'MAERSK-B.CO', 'CARL-B.CO', 'COLOB.CO', 'PNDORA.CO', 'DANSKE.CO', 'NZYM-B.CO', 'TDC.CO', 'VWS.CO'],
    fields : {
        companies: ['name', 'exchange', 'changePercent', 'ask', 'bid', 'lastTradePrice', 'symbol'],
        details : ['name', 'exchange', 'changePercent', 'ask', 'bid', 'lastTradePrice','volume', 'lastTradeDate', 
            'daysLow', 'daysHigh', 'yearLow', 'yearHigh']

    }
};