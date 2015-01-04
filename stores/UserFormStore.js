var Store = require("../theLib/BasicStore");


module.exports = function(context){


var UserForm = {
	data:{},
	errors:[]
};


var UserFormStore = Store.create({
	init: function(){
			context.actions.on('submit:newUser:rejected', this.updateUserErrors);
			context.actions.on('users:user:add', this.cleanStore);
			context.actions.on('users:user:clean', this.cleanStore);
			context.actions.on('users:user:fill', this.fillData);		
	},
	fillData: function(userData){
			UserForm = {
				data: userData
			}
			UserFormStore.emit('change', UserForm);
		
	},
	cleanStore: function(){
		console.log("CLEANING");
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
})


return UserFormStore;
}