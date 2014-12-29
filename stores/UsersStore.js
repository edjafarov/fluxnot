var Emitter = require('events').EventEmitter;
module.exports = function(){

var Users = [];

var UsersStore = Object.create(new Emitter(), {
	init: {value:function(ctx){
		Object.keys(ctx).reduce(function(context, name){
			context[name] = ctx[name];
			return context;
		}, this);		
		this.actions.on('users:user:add', this.addUser);
		this.actions.on("users:get", this.updateUsers);
	}},
	addUser: {value:function(data){
		Users.push(data);
		UsersStore.emit('change', Users);
	}},
	updateUsers: {value:function(userData){
		Users = userData;
		UsersStore.emit('change', Users);
	}},
	get: {value:function(){
		return Users;
	}}
}); 


	return UsersStore;
}
//module.exports = UsersStore;