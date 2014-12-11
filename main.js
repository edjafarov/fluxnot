var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Actions = require('./Actions');
var App = require('./App');
var UsersList = require('./components/UsersList');
var UserDetails = require('./components/UserDetails');
var UserStore = require('./UserStore');
var Promise = require('es6-promise').Promise;
var FluxNot = require('./fluxnot');


var UsersMock = [
  {
    id: 0,
    name: "Bob",
    age: 23,
    bio: "stuff"
  },
  {
    id: 1,
    name: "Sally",
    age: 33,
    bio: "stuff1"
  },
  {
    id: 2,
    name: "John",
    age: 22,
    bio: "stuff2"
  }
];

var isClient = true;

var routes = (
  <Route handler={App}>
    <Route name="users" path="users" handler={UsersList}>
      <Route name="user" path="user/:userId" handler={UserDetails} />
    </Route>

  </Route>
);


function log(data){
  if(this.path){
    console.log(["Url Action, path:", this.path].join(''));
    if(this.query) console.log(["            query:", JSON.stringify(this.query)].join(''));
    if(this.params) console.log(["            params:", JSON.stringify(this.params)].join(''));
  }
  return data;
}

Actions.use(log);
Actions.use(FluxNot.client.renderIfClient);
Actions.use(Actions.actionRouter);
Actions.use(FluxNot.client.renderIfServer);


Actions.create('/users').then(function doit1(){
  var that = this;
  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil(UsersMock);
    }, 400);
  })
});

Actions.create('/users/user/:userId').then(function doit2(){
  var that = this;
  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil(UsersMock[that.params.userId]);
    }, 400);
  })
})
function isRequired(name){
  return function(data){

    if(!data[name] || data[name] == ""){
      if(!this.errors) this.errors = []
      this.errors.push({varName: name, type:"required"});
    }
    return data;
  }
}

function isLonger(name){
  return {
    then: function(then){
      return function(data){
        if(data[name] && data[name].length < then){
          if(!this.errors) this.errors = []
          this.errors.push({varName: name, type:"length is not ehough"});
        }
        return data;       
      }
    }
  }
}

function submit(data){
  this.emit('users:user:add', data);
  return data;
}

function ifValidationRejected(data){
  if(this.errors) return Promise.reject(this.errors);
  return data;
}

Actions.create('submit:newUser').then(function(data){
  delete data.errors;
  return data;
}).then(isRequired('name'))
.then(isLonger('name').then(5))
.then(isRequired('id'))
.then(isRequired('age'))
.then(ifValidationRejected)
.then(submit);

/*
Actions.create('/user/:userID').then(function doit(){
  var that = this;

  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil({uid: that.params.userID, age: that.query.showAge?33:''});
    }, 400);
  })
});
*/

var isClient = true;
try{
  document 
}catch(e){
  isClient = false;
}
if(isClient){
  FluxNot.client.createClient({
    routes: routes,
    Actions: Actions
  });
}

module.exports = function(){
  return FluxNot.server.createServer({
    routes: routes,
    Actions: Actions,
    indexTemplate: require('fs').readFileSync("./index.html")
  });
}



/*


/*
fetch('/api/test', function(){})
fetch('/api/test1', function(){})
fetch('/api/test1?tes={baz}', function(){return {baz: this.query.baz}})
fetch('/api/{foo}/test1?tes={bar}', function(){return {foo: this.foo, bar: this.params.bar}})
||
doOnce
request('/multifetch', {fetch:['/api/test', '/api/test1','/api/test1?tes={baz}','/api/{foo}/test1?tes={bar}']});
||result
{
  '/api/test': {}, 
  '/api/test1': {},
  '/api/test1?tes={baz}': {},
  '/api/{foo}/test1?tes={bar}': {}
}
*/

//TODO: initial load
/* while loadin initailly it is better to render after inidial data will come in 
  so first client time should be like server one.
*/
/*

*/

/*
API:
*/