var mongoose = require('mongoose'),
Schema = mongoose.Schema;


var transactionSchema = mongoose.Schema({
	custodyId : Schema.Types.ObjectId,
	cashAccountId : Schema.Types.ObjectId,
    symbol : String,
    type : String,
    amount : Number,
    price : Number,
    commission : Number,
    date : Date,
    action : String
  });


  module.exports= mongoose.model('Transaction', transactionSchema);
