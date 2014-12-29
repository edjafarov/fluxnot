var Emitter = require('events').EventEmitter;

module.exports = function(){
var User = [];

var UserStore = Object.create(new Emitter(), {
	init: {value: function(ctx){
		Object.keys(ctx).reduce(function(context, name){
			context[name] = ctx[name];
			return context;
		}, this);		
		this.actions.on("user:get", this.updateUser);
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
//module.exports = UserStore;