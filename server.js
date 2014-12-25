var express = require('express');
var app = express();
var fs = require('fs');
require('node-jsx').install({harmony: true})
var clientApp = require("./main.js");

app.get('/bundle.js', function(req, res){
	fs.createReadStream('./bundle.js').pipe(res);
});

app.use(clientApp.middleware);

app.listen(3000);