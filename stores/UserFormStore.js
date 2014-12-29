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
			this.actions.on('submit:newUser:rejected', this.updateUserErrors);
			this.actions.on('users:user:add', this.cleanStore);
			this.actions.on('users:user:clean', this.cleanStore);
			this.actions.on('users:user:fill', this.fillData);
			//Actions.on('submit:newUser', this.updateUserErrors);
			
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