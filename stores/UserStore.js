var Emitter = require('events').EventEmitter;

module.exports = function(context){
var User = [];

var UserStore = Object.create(new Emitter(), {
	init: {value: function(){
		context.actions.on("user:get", this.updateUser);
	}},
	updateUser: {value: function(userData){
		User = userData;
		UserStore.emit('change', User);
	}},
	get: {value: function(){
		return User;
	}}
}); 


return UserStore;
}
