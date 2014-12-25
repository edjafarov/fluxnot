var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;



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







var appCfg = {
  router: function(url, cb){ // the router accepts url and cb
    if(url){
      // pass the url if defined
      return Router.run(routes, url, cb);
    } else {
      // set up the router listener for browser
      return Router.run(routes, Router.HistoryLocation, cb);
    }
  },
  context: { //we need to define what actions and stores we will use
    routingActions: require("./routingActions/routingActions"),
    appActions: require("./appActions/appActions"),
    UserFormStore: require("./stores/UserFormStore"),
    UserStore: require("./stores/UserStore"),
    UsersStore: require("./stores/UsersStore")  
  }
};


//Read Template
if(FluxNot.isServer) var indexTemplate = require('fs').readFileSync("./index.html")


var createApp = require("./theLib/RouteHandler");
var app = createApp(appCfg);

module.exports =  {
  mixin: {
    //context mixin for React compoennts
    contextTypes: Object.keys(app.context).reduce(function(types, name){
      types[name] = React.PropTypes.object.isRequired;
      return types;
    },{})
  },
  middleware: function(req, res){
    // render as HTML
    app.renderUrl(req.originalUrl, function(Handler, state){
      // this.render - define context render function
      state.render = function(){
        React.withContext(state, function(){ // render the Handler with current context
          var renderedApp = React.renderToString(<Handler/>);
          res.end(indexTemplate.toString().replace('<body>','<body><div id="content">' + renderedApp + '<div>'));
        })
      }
      // check routes to trigger
      var urlsMatched = this.routes.map(function(route){
        return route.path;
      });
     
      if(urlsMatched.length > 0){
        // trigger routing actions
        state.routingActions.doAction.call(this, urlsMatched, null, this);
      } else {
        this.render()
      }
    })
  }
}


var AppComponent = require('./components/App');
var UsersList = require('./components/UsersList');
var UserDetails = require('./components/UserDetails');

var routes = (
  <Route handler={AppComponent} >
    <Route name="users" path="users" handler={UsersList} >
      <Route name="user" path="user/:userId" handler={UserDetails} />
    </Route>
  </Route>
);


if(app.isClient) { //If client - init the app, on route change set up context and trigger routing actions
  app.initApp(function(Handler, state){
      state.render = function(){
        React.withContext(state, function(){
          React.render(<Handler/>, document.getElementById('content'));
        })
      }
      var urlsMatched = this.routes.map(function(route){
        return route.path;
      });
     
      if(urlsMatched.length > 0){
        state.routingActions.doAction.call(this, urlsMatched, null, this);
      } else {
        this.render()
      }    
  });
}
/*
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
  var appIn = app.route();
  module.exports = appIn;
  appActions.defaultContext({
    app: appIn
  });
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