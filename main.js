var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
//var Actions = require('./Actions');
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
  } else {
    console.log("Log:", data, this);
  }
  return data;
}


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

/*
Actions.create('submit:newUser').then(function(data){
  delete data.errors;
  return data;
}).then(isRequired('name'))
.then(isLonger('name').then(5))
.then(isRequired('id'))
.then(isRequired('age'))
.then(ifValidationRejected)
.then(submit);
*/

var PromisePiper = require("./PromisePiper");
var ActionsRouter = require("./ActionsRouter")
var ActionsEmitter = require("./ActionsEmitter");

function bindEmitter(ActionsEmitter){
  return function (data){
    this.emit = ActionsEmitter.emit.bind(ActionsEmitter);
    return data;
  }
}


var doActions = ActionsRouter();


doActions.create('/users')
.then(function(data){
  var that = this;
  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil(UsersMock);
    }, 400);
  })
}).then(function(response){
  this.emit("users:get", response);
  return response;
})


doActions.create('/users/user/:userId')
.then(function(data){
  var that = this;
  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil(UsersMock[that.params.userId]);
    }, 400);
  })
}).then(function(response){
  this.emit("user:get", response);
  return response;
})

var onRoute = PromisePiper()
.then(log)
.then(bindEmitter(ActionsEmitter)) // to be able to do centralized this.emit
.then(renderIfClient)
.then(doActions)
.then(renderIfServer)
.then(log)
.catch(function(){
  console.log(arguments, "ERROR!!!!");
})


var clientRederedOnce = false;

function renderIfClient(data){
  console.log(FluxNot.isClient && clientRederedOnce && this.path);
  if(isClient && clientRederedOnce && this.path) {
    this._render();
    clientRederedOnce = true;
  }
  return data;
}

function renderIfServer(result){
  if(this.path && (!FluxNot.isClient || !clientRederedOnce)) {
    if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
    this._emitted = true;
    this._render();
  }
  return result;
}


var appCfg = {
  routes: routes
};

//Read Template
if(FluxNot.isServer) appCfg.indexTemplate = require('fs').readFileSync("./index.html")

var app = FluxNot(appCfg);


app.doOnRoute(function(){
  var urlsMatched = this.routes.map(function(route){
    return route.path;
  });

  if(urlsMatched.length > 0 && !app.clientRenderedOnce){
    this.actionName = urlsMatched;
    onRoute.call(this);
  } else if (urlsMatched.length > 0 && app.clientRenderedOnce) {
    console.log(onRoute)
    this.actionName = urlsMatched[urlsMatched.length - 1];;
    onRoute.call(this);
  } else {
    this._render()
  }
});

if(FluxNot.isClient) app.route();

module.exports = function(){
  return app.middleware;
}


/*
FluxNot.client.doOnRoute(onRoute)

var client;
var isClient = true;
try{
  document 
}catch(e){
  isClient = false;
}
if(isClient){
  FluxNot.client.createClient({
    routes: routes
  });
}


module.exports = function(){
  FluxNot.server.doOnRoute(onRoute);

  return FluxNot.server.createServer({
    routes: routes,
    indexTemplate: require('fs').readFileSync("./index.html")
  });
}




/*
var actionsRouter = function(data){
  var actionName = this.actionName;
  actionsRouter._routes[actionName].bind(this);
  return actionsRouter._routes[actionName](data)
}

actionsRouter.create = function(name){
  actionsRouter._routes[name] = PromisePiper();
  return actionsRouter._routes[name];
}

actionsRouter.routeExists = function(){
  
}

actionsRouter.create('/user/:id').then().then().then();
actionsRouter.create('/user/:id/documents').then().then().then();
actionsRouter.create('/user/:id/documents/:id').then().then().then();

var onRouteActions = PromisePiper()
.then(log)
.then(renderIfClient)
.then(actionsRouter)
.then(renderIfServer)
.catch(showCommonError);

routes.pipe(onRouteActions)
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