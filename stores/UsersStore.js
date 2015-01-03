var Emitter = require('events').EventEmitter;
module.exports = function(context){

var Users = [];

var UsersStore = Object.create(new Emitter(), {
	init: {value:function(){	
		context.actions.on('users:user:edit', this.editUser);
		context.actions.on('users:user:add', this.addUser);
		context.actions.on("users:get", this.updateUsers);
	}},
	editUser: {value:function(data){
		Users[data.id] = data;
		UsersStore.emit('change', Users);
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
