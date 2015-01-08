var Promise = require('es6-promise').Promise;
var PromisePiper = require("../theLib/PromisePiper");
var Resource = require('../theLib/Resource');

module.exports = {
	
	usersList: PromisePiper()
	.then(Resource.get("/api/users"))
	.then(function(response, context){
	  context.emit("users:get", response);
	  return response;
	}),

	user: PromisePiper()
	.then(Resource.get("/api/users/:userId"))
	.then(function(response, context){
	  context.emit("user:get", response);
	  return response;
	}),

	userEdit: PromisePiper()
	.then(Resource.get("/api/users/:userId"))
	.then(function(response, context){
	  context.emit("users:user:fill", response);
	  return response;
	}),
	userCreate: PromisePiper()
	.then(function(response, context){
	  context.emit("users:user:clean");
	  return response;		
	})
}

/*
function(data){
	  var that = this;
	  return new Promise(function(fulfil, rej){
	    setTimeout( function(){
	      fulfil(UsersMock);
	    }, 400);
	  })
	}
*/