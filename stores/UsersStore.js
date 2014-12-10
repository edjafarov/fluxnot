var Actions = require('../Actions');
var Emitter = require('events').EventEmitter;

var Users = [];

var UsersStore = {
	init: function(){
		Actions.on('/users', this.updateUsers);
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