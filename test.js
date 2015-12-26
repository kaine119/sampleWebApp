var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/gci_tasks";

MongoClient.connect(url, function(err, db){
	var cursor = db.collection('users').find();
	cursor.each(function(err, user){
		if (user != null) {
			console.log(user.username)
		}
	})
})
