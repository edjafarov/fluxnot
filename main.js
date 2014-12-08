var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Actions = require('./Actions');
var App = require('./App');
var User = require('./User');
var UserStore = require('./UserStore');
var Promise = require('es6-promise').Promise;

var isClient = true;

var routes = (
  <Route handler={App}>
    <Route name="user" path="user/:userID" handler={User}/>
  </Route>
);


function renderIfClient(data){
  if(isClient && init) this._render();
  return data;
}
function renderIfServer(result){
  if(!isClient || !init) {
    this.end = function end(result){
      if(this._emitted) return;
      console.log("emit on Action END ", this.actionName);
      this._emitted = true;
      Actions.emit(this.actionName, result);
      this._render();
    }
  }
  return result;
}

function log(data){
  if(this.path){
    console.log(["Url Action, path:", this.path].join(''));
    if(this.query) console.log(["            query:", JSON.stringify(this.query)].join(''));
    if(this.params) console.log(["            params:", JSON.stringify(this.params)].join(''));
  }
  return data;
}

Actions.use(log);
Actions.use(renderIfClient);
Actions.use(Actions.actionRouter);
Actions.use(renderIfServer);

Actions.create('/user/:userID').then(function doit(){
  var that = this;
  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      fulfil({uid: that.params.userID, age: that.query.showAge?33:''});
    }, 400);
  })
});

Actions.create('/').then(function doit(){
  var that = this;
  return new Promise(function(fulfil, rej){
    setTimeout( function(){
      console.log("HOME");
      fulfil();
    }, 400);
  })
});

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
var init = false;
try{
Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  state._render = function(){
    console.log("RENDER");

    return React.render(<Handler/>, document.getElementById('content'));
    init = true;
  }

  var urlMatched = state.routes[state.routes.length - 1].path;
  if(Actions[urlMatched]) {
    Actions.doAction(urlMatched, state);
  } else {
    state._render();
  }
});
}catch(e){console.log(e)}

module.exports = function renderForServer(url, cb){
  isClient = false;
  Router.run(routes, url, function (Handler, state) {
    state._render = function(){
      var result = React.renderToString(<Handler/>);
      console.log("RENDER server" + result);
      cb(null, "<html><head></head><body><div id='content'>" + result + "</div><script src='/bundle.js'></script></body></html>");
    }

    var urlMatched = state.routes[state.routes.length - 1].path;
    if(Actions[urlMatched]) {
      Actions.doAction(urlMatched, state);
    } else {
      state._render();
    }
  });
}


/*
API:
*/