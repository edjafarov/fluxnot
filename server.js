var express = require('express');
var app = express();
var fs = require('fs');
require('node-jsx').install({harmony: true})
var renderable = require("./main.js");

app.get('/bundle.js', function(req, res){
	fs.createReadStream('./bundle.js').pipe(res);
});


app.get('*', function(req, res){
  renderable(req.originalUrl, resp);
  function resp(err, data){
  	res.end(data);
  }
});

app.listen(3000);