var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require("mongodb").ObjectId;
var url = "mongodb://localhost:27017/gci_task";

//Password hasing mudule
var passwordHash = require('password-hash');

var exports = module.exports

// Insert a user into db
exports.insertUser = function(name, pwrd, email, db, existingCallback, callback) {
	db.collection('users').findOne({"username": name}, function(err, user) {
		assert.equal(err, null)
		if (user) {
			existingCallback();
		} else {
			db.collection('users').insertOne( {
				"username": name,
				"password": passwordHash.generate(pwrd),
				"email": email
			}, function(err, result){
				assert.equal(err, null);
				console.log("inserted a document into the users collection.");
				callback(result);
			});
		}
	})
};

exports.loginUser = function(name, password, db, successCallback, failCallback) {
	var cursor = db.collection('users').find({"username": name});
	cursor.each(function(err, user){
		assert.equal(err, null);
		if (user != null && user.username == name && passwordHash.verify(password, user.password)) {
			console.log("success!")
			successCallback();
		}
		else if (user != null) {
			console.log("hi")
		} else if (user==null) {
			failCallback();
		}
	});
}

// function to list all users in db
exports.listUser = function(db, showUserCallback, endCallback){
	var cursor = db.collection('users').find();
	cursor.each(function(err, doc){
		assert.equal(err, null);
		if (doc != null) {
			showUserCallback(doc.username, doc.email);
		} else {
			endCallback();
		}
	});
}
