var mongoose     = require('mongoose'),
	config = require('../../config'),
  	jwt = require('jsonwebtoken');

var holdingSchema = mongoose.Schema({
	symbol : String,
	amount : Number,
	avgPurchasePrice : Number 
});

var custodySchema = mongoose.Schema({
	name : String,
	holdings : [holdingSchema]
});

var cashAccountSchema = mongoose.Schema({
	name : String,
	currency : String,
	balance : Number
});

var userSchema = mongoose.Schema({
    login: { type: String, index: { unique: true } },
    password: String,
    custodyAccounts: [custodySchema],
    cashAccounts: [cashAccountSchema]
  });


userSchema.methods.checkPassword = function (password) {
	return this.password === password;
};

userSchema.methods.prepareForTransfer = function () {
	this.password = null;
	return this;
};

userSchema.methods.getToken = function() {
	return jwt.sign({id: this._id}, config.secret, { expiresInMinutes: 60*5 });
};

userSchema.methods.getCashAccountById = function(id) {
	var acc = null;
	this.cashAccounts.forEach(function(cashAccount){
		if (cashAccount.id==id) {
			acc = cashAccount;
		}
	});
	return acc;
};

userSchema.methods.getCustodyAccountById = function(id) {
	var acc = null;
	this.custodyAccounts.forEach(function(custodyAccount){
		if (custodyAccount.id==id) {
			acc = custodyAccount;
		}
	});
	return acc;
};


userSchema.statics.addCustody = function(userId, custody, callback){
	this.findById(userId, function (err, user) {
		if (err || !user) {
			callback(err);
			return;
		}
		var subdoc = user.custodyAccounts.create(custody);
		user.custodyAccounts.push(subdoc);
		user.save(function(err){
			callback(err, subdoc);
		});
	});
};

userSchema.statics.addCashAccount = function(userId, cashAccount, callback){
	this.findById(userId, function (err, user) {
		if (err || !user) {
			callback(err);
			return;
		}
		var subdoc = user.cashAccounts.create(cashAccount);
		user.cashAccounts.push(subdoc);
		user.save(function(err){
			callback(err, subdoc);
		});
	});
};

module.exports= mongoose.model('User', userSchema);