var Store = require("../theLib/BasicStore");
module.exports = function(context){

var Users = [];

var UsersStore = Store.create({
	init: function(){	
		context.actions.on('users:user:edit', this.editUser);
		context.actions.on('users:user:add', this.addUser);
		context.actions.on("users:get", this.updateUsers);
	},
	editUser: function(data){
		Users[data.id] = data;
		UsersStore.emit('change', Users);
	},
	addUser: function(data){
		Users.push(data);
		UsersStore.emit('change', Users);
	},
	updateUsers: function(userData){
		Users = userData;
		UsersStore.emit('change', Users);
	},
	get: function(){
		return Users;
	}
}); 


	return UsersStore;
}
