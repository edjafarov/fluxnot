var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Actions = require('./Actions');
var App = require('./App');
var User = require('./User');
var UserStore = require('./UserStore');
var Promise = require('es6-promise').Promise;
var FluxNot = require('./fluxnot');


var isClient = true;

var routes = (
  <Route handler={App}>
    <Route name="user" path="user/:userID" handler={User}/>
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



Actions.create('/user/:userID').then(function doit(){
  var that = this;

  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil({uid: that.params.userID, age: that.query.showAge?33:''});
    }, 400);
  })
});

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