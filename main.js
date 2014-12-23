var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var App = require('./components/App');
var UsersList = require('./components/UsersList');
var UserDetails = require('./components/UserDetails');

var Promise = require('es6-promise').Promise;
var FluxNot = require('./theLib/FluxNot');


UsersMock = [
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



var routes = (
  <Route handler={App}>
    <Route name="users" path="users" handler={UsersList}>
      <Route name="user" path="user/:userId" handler={UserDetails} />
    </Route>

  </Route>
);

var onRoute = require("./routingActions/routingActions").doAction;

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
    onRoute.call(this, urlsMatched, null, this);
  } else if (urlsMatched.length > 0 && app.clientRenderedOnce) {
    onRoute.call(this, urlsMatched[urlsMatched.length - 1], null, this);
  } else {
    this._render()
  }
});

if(!FluxNot.isClient) {
  module.exports = function(){
    return app;
  }
  
} else {
  module.exports = app.route();
}







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