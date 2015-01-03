var Promise = require('es6-promise').Promise;
var PromisePiper = require("../theLib/PromisePiper");

module.exports = {
	
	usersList: PromisePiper().then(function(data){
	  var that = this;
	  return new Promise(function(fulfil, rej){
	    setTimeout( function(){
	      fulfil(UsersMock);
	    }, 400);
	  })
	}).then(function(response){
	  this.emit("users:get", response);
	  return response;
	}),

	user: PromisePiper().then(function(data){
	  var that = this;
	  return new Promise(function(fulfil, rej){
	    setTimeout( function(){
	      fulfil(UsersMock[that.params.userId]);
	    }, 400);
	  })
	}).then(function(response){
	  this.emit("user:get", response);
	  return response;
	}),

	userEdit: PromisePiper().then(function(data){
	  var that = this;
	  return new Promise(function(fulfil, rej){
	    setTimeout( function(){
	      fulfil(UsersMock[that.params.userId]);
	    }, 400);
	  })
	}).then(function(response){
	  this.emit("users:user:fill", response);
	  return response;
	}),
	userCreate: PromisePiper()
	.then(function(response){
	  this.emit("users:user:clean");
	  return response;		
	})
}