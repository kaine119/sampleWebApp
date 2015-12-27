var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//Web hosting, with express.js
var express = require('express');
var app = express();
var http = require('http').Server(app);

//Neccesary for parsing POST reqs
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//url of gci_tasks db (currently on localhost.)
var url = "mongodb://localhost:27017/gci_task";

// functions to interface with db
var dbase = require('./db');

// html snippets to respond for dash.
var html = require('./html-format')

/* End of declarations. */

// Hosting for css files
app.use(express.static('res'));

//Main login page
app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html")
})
//Login submission
app.post("/login", function(req, res) {
	var name = req.body.username;
	var password = req.body.password;
	console.log(name + " tried to log in with pwrd " + password)
	MongoClient.connect(url, function(err, db){
		assert.equal(err, null);
		dbase.loginUser(name, password, db,
								function(){
									res.redirect("/dash");
								},
							 	function(){
									res.sendFile(__dirname + "/wrongDetails.html")
								})
	});
})
//Signup submission
app.post("/signup", function(req, res) {
	var name = req.body.username;
	var password = req.body.password
	var email = req.body.email
	console.log(name + " signed up with pwrd " + password + " and email " + email);
	MongoClient.connect(url, function(err, db) {
		assert.equal(err, null);
		dbase.insertUser(name, password, email, db,
									function(){
										res.redirect("/userAlreadyExists")
									},
									function(){
										db.close();
										res.redirect("/dash")
									})

	})
})

//Dashboard.
app.get('/dash', function(req, res){
	var response = ''
	MongoClient.connect(url, function(err, db){
		assert.equal(err, null);
		dbase.listUser(db, function(username, email){ response += "<tr><td><p>" + username + '</p></td><td><p>' + email + '</p></td></tr>\n';},
											 function(){ db.close(); res.send(html.html1 + response + html.html2) } );
	});
});

// Page to show if user already exists.
app.get("/userAlreadyExists", function(req, res){
	res.sendFile(__dirname + "/userAlreadyExists.html")
})

// Wrong password
app.get("/wrongDetails", function(req, res) {
	res.sendFile(__dirname + "/wrongDetails.html")
})



http.listen(3000, function(){
	console.log("Listening on port 3000")
})
