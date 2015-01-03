var express = require('express');
var app = express();
var fs = require('fs');
require('node-jsx').install({harmony: true})
var clientAppMiddleware = require("./main.js");

app.use(express.static("./assets"));

app.use(clientAppMiddleware);

app.listen(3000);