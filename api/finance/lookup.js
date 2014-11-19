var http = require('http');

var lookup = function(query, callback)  {
    var request = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc?query='
        +query+'&callback=YAHOO.Finance.SymbolSuggest.ssCallback';

    http.get(request, function(res) {
        res.setEncoding('utf8');
        if ( res.statusCode!=200) throw new Error("Error: "+res.statusCode);
        var data = "";
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function() {
            data = data.substring(39, data.length-1);
            var result = JSON.parse(data);
            callback(result.ResultSet.Result);
        });

    }).on('error', function(e) {
            throw e;
        });

}

module.exports = lookup;