var Emitter = require('events').EventEmitter;


module.exports = function(){


var UserForm = {
	data:{},
	errors:[]
};


var UserFormStore = Object.create(new Emitter(), {
	init: {
		value: 	function(ctx){
			Object.keys(ctx).reduce(function(context, name){
				context[name] = ctx[name];
				return context;
			}, this);
			this.appActions.on('submit:newUser:rejected', this.updateUserErrors);
			this.appActions.on('users:user:add', this.cleanStore);
			//Actions.on('submit:newUser', this.updateUserErrors);
			
			//Actions.on('/users/user/:userId/edit', this.updateUserToEdit);
		}
	},
	cleanStore: {value: function(){
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