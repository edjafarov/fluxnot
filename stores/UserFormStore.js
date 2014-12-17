
var Emitter = require('events').EventEmitter;

var User = {};

var UserFormStore = {
	init: function(){
		//Actions.on('submit:newUser', this.updateUserErrors);
		//Actions.on('submit:newUser:rejected', this.updateUserErrors);
		//Actions.on('/users/user/:userId/edit', this.updateUserToEdit);
	},
	updateUserErrors: function(errorData){
		UserFormStore.emit('errors', errorData);
	},
	updateUserToEdit: function(userData){
		User = userData;
		UserFormStore.emit('change', User);
	},
	get: function(){
		return User;
	}
}; 

UserFormStore.__proto__ = new Emitter();


UserFormStore.init();

module.exports = UserFormStore;