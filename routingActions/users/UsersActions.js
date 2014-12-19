var Validator = require("../../Validators");
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Promise = require('es6-promise').Promise;


module.exports = function(actions){
	
	actions.create('/users')
	.then(function(data){
	  var that = this;
	  return new Promise(function(fulfil, rej){
	    setTimeout( function(){
	      fulfil(UsersMock);
	    }, 400);
	  })
	}).then(function(response){
	  this.emit("users:get", response);
	  return response;
	})


	actions.create('/users/user/:userId')
	.then(function(data){
	  var that = this;
	  return new Promise(function(fulfil, rej){
	    setTimeout( function(){
	      fulfil(UsersMock[that.params.userId]);
	    }, 400);
	  })
	}).then(function(response){
	  this.emit("user:get", response);
	  return response;
	})
}


