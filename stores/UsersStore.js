var Emitter = require('events').EventEmitter;
var ActionsEmitter = require("../ActionsEmitter");
var Users = [];

var UsersStore = {
	init: function(){
		//Actions.on('/users', this.updateUsers);
		//Actions.on('users:user:add', this.addUser);
		ActionsEmitter.on("users:get", this.updateUsers);
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
}; 

UsersStore.__proto__ = new Emitter();


UsersStore.init();

module.exports = UsersStore;