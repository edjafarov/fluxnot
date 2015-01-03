var Validator = require("../Validators");
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;



module.exports = function(actions){
	
	actions.create("submit:newUser")
	.then(Validator.isRequired('name'))
	.then(Validator.isLonger('name').then(5))
	.then(Validator.isRequired('age'))
	.then(ifValidationRejected)
	.then(submit)
	.catch(emitFormError);
	
}
/*
or
.then(Validator.check([
	Validator.isRequired('name'),
	Validator.isLonger('name').then(5),
	Validator.isRequired('age')
]))
*/


function submit(data){
	if(data.id){
		this.emit('users:user:edit', data); 	
	} else {
		data.id = UsersMock.length;
	  this.emit('users:user:add', data); 
	}
  this.app.transitionTo('user', {userId: data.id});
  return data;
}

function ifValidationRejected(data){
  if(this.errors) return Promise.reject(this.errors);
  return data;
}

function emitFormError(error){
	this.emit('submit:newUser:rejected', error);
}
