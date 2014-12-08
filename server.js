var express = require('express');
var app = express();
var fs = require('fs');
require('node-jsx').install({harmony: true})
var renderable = require("./main.js");

app.get('/bundle.js', function(req, res){
	fs.createReadStream('./bundle.js').pipe(res);
});

app.use(renderable());

app.listen(3000);