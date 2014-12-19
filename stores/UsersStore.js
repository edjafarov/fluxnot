var Emitter = require('events').EventEmitter;
var RouteActionsEmitter = require("../routingActions/routingActions");
var Actions = require("../appActions/appActions");
var Users = [];

var UsersStore = {
	init: function(){
		//Actions.on('/users', this.updateUsers);
		Actions.on('users:user:add', this.addUser);
		RouteActionsEmitter.on("users:get", this.updateUsers);
	},
	addUser: function(data){
		console.log(Users, data);
		Users.push(data);
		console.log(Users, data);
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