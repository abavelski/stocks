var http = require('http');
var csv = require('csv');

var StockHistory = function() {
    var self = this;
    var period = "d";
    var symbol = "YHOO";
    var from, to;
    var myCallback = function(data) {
        console.log(data);
    }

    self.daily = function() {
        period = "d";
        return self;
    }

    self.weekly = function() {
        period = "w";
        return self;
    }

    self.monthly = function() {
        period = "m";
        return self;
    }

    self.dividendsOnly = function() {
        period = "v";
        return self;
    }

    self.forSymbol = function(mySymbol) {
        symbol = mySymbol;
        return self;
    }


    self.from = function(fromDate) {
        if (typeof fromDate == 'string') {
            from = new Date(fromDate);
        } else {
            from = fromDate;
        }
        return self;
    }

    self.to = function(toDate) {
        if (typeof toDate == 'string') {
            to = new Date(toDate);
        } else {
            to = toDate;
        }
        return self;
    }

    var compare = function(a,b) {
        if (a[0] < b[0])
                return -1;
                    if (a[0] > b[0])
                return 1;
                return 0;
            }

    var transformData = function(data) {
        if (period==='v') {
            console.log(data);
            return;
        }
        var resp = [];
        for (var i=1;i<data.length; i++) {
           /* resp.push({
                date : new Date(data[i][0]),
                open : parseFloat(data[i][1]),
                high : parseFloat(data[i][2]),
                low : parseFloat(data[i][3]),
                close : parseFloat(data[i][4]),
                volume : parseInt(data[i][5]),
                adjClose: parseFloat(data[i][6])
            });
            */
            var myDate = new Date(data[i][0]);
            resp.push([
                    myDate.getTime(),
                    parseFloat(data[i][4])
                    ]);
        }

        resp.sort(compare);
        myCallback(resp);
    }

    self.getHistory = function(callback) {
        console.log('getHistory');
        var url = "http://ichart.yahoo.com/table.csv?s="+symbol+"&g="+period;
        if (from) {
            url+='&a='+from.getMonth()+'&b='+from.getUTCDate()+'&c='+from.getUTCFullYear()
        }
        if (to) {
            url+='&d='+to.getMonth()+'&e='+to.getUTCDate()+'&f='+to.getUTCFullYear()
        }
        url+='&ignore=.csv';
        console.log('URL:'+url);
        if (callback) {
            myCallback = callback;
        }
        http.get(url, function(res) {
            console.log('response received');
            if ( res.statusCode!=200) throw new Error("Error: "+res.statusCode);
            csv().from.stream(res).to.array(transformData);
        }).on('error', function(e) {
                throw e;
            });
    }

};

module.exports = new StockHistory();