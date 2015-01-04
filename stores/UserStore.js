var Store = require("../theLib/BasicStore");

module.exports = function(context){
var User = [];

var UserStore = Store.create({
	init: function(){
		context.actions.on("user:get", this.updateUser);
	},
	updateUser: function(userData){
		User = userData;
		UserStore.emit('change', User);
	},
	get:  function(){
		return User;
	}
}); 


return UserStore;
}
