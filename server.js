var express = require('express');
var app = express();
var fs = require('fs');
require('node-jsx').install({harmony: true})
var clientAppMiddleware = require("./main.js");

app.use(express.static("./assets"));

app.use(clientAppMiddleware);


app.get("/api/users", function(req, res){
	res.json([
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
	]);
})

app.listen(3000);