var Actions = require("../appActions/appActions");
var Emitter = require('events').EventEmitter;

var UserForm = {
	data:{},
	errors:[]
};

var UserFormStore = {
	init: function(){
		Actions.on('submit:newUser:rejected', this.updateUserErrors);
		Actions.on('users:user:add', this.cleanStore);
		//Actions.on('submit:newUser', this.updateUserErrors);
		
		//Actions.on('/users/user/:userId/edit', this.updateUserToEdit);
	},
	cleanStore: function(){
		UserForm = {
			data:{},
			errors: []
		};
		UserFormStore.emit('change', UserForm);
	},
	updateUserErrors: function(errorData){
		UserForm.errors = errorData;
		UserFormStore.emit('change', UserForm);
	},
	get: function(){
		return UserForm;
	}
}; 

UserFormStore.__proto__ = new Emitter();


UserFormStore.init();

module.exports = UserFormStore;