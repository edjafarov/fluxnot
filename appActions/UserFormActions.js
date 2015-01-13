var Validator = require("../Validators");
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Resource = require('../theLib/Resource');


module.exports = function(actions){
	
	actions.create("submit:newUser")
	.then(Validator.isRequired('name'))
	.then(Validator.isLonger('name').then(5))
	.then(Validator.isRequired('age'))
	.then(ifValidationRejected)
	.post('/api/users')
	.then(submitted)
	.catch(emitFormError);


	actions.create("submit:editUser")
	.then(Validator.isRequired('name'))
	.then(Validator.isLonger('name').then(5))
	.then(Validator.isRequired('age'))
	.then(ifValidationRejected)
	.put('/api/users/:userId')
	.then(submitted)
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

function edited(data){
	this.emit('users:user:edit', data); 	
  this.app.transitionTo('user', {userId: data.id});
  return data;
}


function submitted(data){
	this.emit('users:user:add', data); 
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
