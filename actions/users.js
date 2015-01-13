var Promise = require('es6-promise').Promise;
var PromisePiper = require("../theLib/PromisePiper");



module.exports = {
	
	usersList: PromisePiper()
	.get("/api/users")
	.emit("users:get"),

	user: PromisePiper()
	.get("/api/users/:userId")
	.emit("user:get"),

	userEdit: PromisePiper()
	.get("/api/users/:userId")
	.emit("users:user:fill"),

	userCreate: PromisePiper()
	.emit("users:user:clean")
	
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