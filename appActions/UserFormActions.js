var Validator = require("../Validators");
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;



module.exports = function(actions){
	
	actions.create("submit:newUser")
	.then(function(data){
	  delete data.errors;
	  return data;
	}).then(Validator.isRequired('name'))
	.then(Validator.isLonger('name').then(5))

	.then(Validator.isRequired('age'))
	.then(ifValidationRejected)
	.then(submit)
	.catch(emitFormError);
}


function submit(data){
	data.id = UsersMock.length;
  this.emit('users:user:add', data);
  return data;
}

function ifValidationRejected(data){
  if(this.errors) return Promise.reject(this.errors);
  return data;
}

function emitFormError(error){
	this.emit('submit:newUser:rejected', error);
}
