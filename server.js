var express = require('express');
var session = require('cookie-session');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
require('node-jsx').install({harmony: true})
process.env.HOSTNAME = "http://localhost:3000"
var clientAppMiddleware = require("./main.js");

app.use(express.static("./assets"));

app.use(session({keys:['app']}))


var Users = [
	  {
	    id: 0,
	    name: "Bob",
	    age: 23,
	    bio: "stuff"
	  },
	  {
	    id: 1,
	    name: "Sally",
	    age: 33,
	    bio: "stuff1"
	  },
	  {
	    id: 2,
	    name: "John",
	    age: 22,
	    bio: "stuff2"
	  }
	];

app.use(bodyParser.json());
app.get("/api/users", function(req, res){
	var n = req.session.views || 0
  req.session.views = ++n
  console.log(req.session.views, "sess")
	res.json(Users);
});

app.post("/api/users", function(req, res){
	var User = req.body;
	User.id = Users.length;
	Users.push(User)
	res.json(User);
});

app.put("/api/users/:id", function(req, res){
	var newUser = req.body;
	Users[newUser.id] = newUser;
	res.json(newUser);
});

app.get("/api/users/:id", function(req, res){
	res.json(Users[req.params.id]);
});

app.use(clientAppMiddleware);

app.listen(3000);