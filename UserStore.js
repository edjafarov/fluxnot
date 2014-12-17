//var Actions = require('./Actions');
var Emitter = require('events').EventEmitter;

var User = {};

var UserStore = {
	init: function(){
		//Actions.on('/user/:userID', this.updateUser);
	},
	updateUser: function(userData){
		User = userData;
		UserStore.emit('change', User);
	},
	get: function(){
		return User;
	}
}; 

UserStore.__proto__ = new Emitter();


UserStore.init();

module.exports = UserStore;