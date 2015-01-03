var Emitter = require('events').EventEmitter;


module.exports = function(context){


var UserForm = {
	data:{},
	errors:[]
};


var UserFormStore = Object.create(new Emitter(), {
	init: {
		value: 	function(){
			context.actions.on('submit:newUser:rejected', this.updateUserErrors);
			context.actions.on('users:user:add', this.cleanStore);
			context.actions.on('users:user:clean', this.cleanStore);
			context.actions.on('users:user:fill', this.fillData);
		}
	},
	fillData: { value: function(userData){
			UserForm = {
				data: userData
			}
			UserFormStore.emit('change', UserForm);
		}
	},
	cleanStore: {value: function(){
		console.log("CLEANING");
		UserForm = {
			data:{},
			errors: []
		};
		UserFormStore.emit('change', UserForm);
	}},
	updateUserErrors: {value: function(errorData){
		UserForm.errors = errorData;
		UserFormStore.emit('change', UserForm);
	}},
	get:{value: function(){
		return UserForm;
	}}
})


return UserFormStore;
}