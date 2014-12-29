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


/*****

Action
  inside action I should have access to data/request/emit 
  data - input
  request - input
  emit - server, new each other, client the same each time
Store
  store shoul be new each time on server and single on client
  inside store I should have access to actions emitter and emit self
Component
  should have access to store/context, to action triggring



context.actions.on() --> in store

context.$render = function(){
  this.context.stores(soreName).on... (component)
  context.actions.doAction() (component)
}
*/

var AppComponent = require('./components/App');
var UsersList = require('./components/UsersList');
var UserDetails = require('./components/UserDetails');
var NewUserForm = require('./components/NewUserForm');
var actions = require('./actions/actions')

var routes = (
  <Route handler={AppComponent}>
    <Route name="users" path="users" handler={UsersList} action={actions.users.usersList}>
      <Route name="userCreate" path="create" handler={NewUserForm} action={actions.users.userCreate}/>
      <Route name="user" path=":userId" handler={UserDetails} action={actions.users.user}/>
      <Route name="userEdit" path=":userId/edit" handler={NewUserForm} action={actions.users.userEdit}/>
    </Route>
  </Route>
);


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
  stores: { //we need to define what actions and stores we will use
    UserFormStore: require("./stores/UserFormStore"),
    UserStore: require("./stores/UserStore"),
    UsersStore: require("./stores/UsersStore")  
  }
};


//Read Template
if(FluxNot.isServer) var indexTemplate = require('fs').readFileSync("./index.html")

var appActions = require("./appActions/appActions")();
var ReactRouterAdapter = require("./theLib/ReactRouterAdapter");

ReactRouterAdapter.parseActions(routes).forEach(function(route){
  appActions.actionsRouter.create(route.path, route.action);
})


var createApp = require("./theLib/RouteHandler");
var app = createApp(appCfg);

module.exports =  {
  middleware: function(req, res){
    // render as HTML
    app.renderUrl(req.originalUrl, function(Handler, state){
      // this.render - define context render function
      state.$render = function(){
        //PUT doAction in components context
        var doAction = appActions.withContext(state).doAction;

        React.withContext({actions:doAction, stores: state.stores}, function(){ // render the Handler with current context
          var renderedApp = React.renderToString(<Handler/>);
          res.end(indexTemplate.toString().replace('<body>','<body><div id="content">' + renderedApp + '<div>'));
        })
      }
      
      // check routes to trigger
      var urlsMatched = this.routes.map(function(route){
        return route.path;
      });
      
      if(urlsMatched.length > 0){
        // trigger routing actions within the context
        appActions.doAction.call(this, urlsMatched, null, this);
      } else {
        this.$render()
      }
    })
  }
}





if(app.isClient) { //If client - init the app, on route change set up context and trigger routing actions
  app.initApp(function(Handler, state){
      //state.appActions.context.app = state.app;
      state.$render = function(){
        var doAction = appActions.withContext(state).doAction;
        React.withContext({actions:doAction, stores: state.stores}, function(){
          React.render(<Handler/>, document.getElementById('content'));
        })
      }
      var urlsMatched = this.routes.map(function(route){
        return route.path;
      });
      
      if(urlsMatched.length > 0){
        appActions.doAction.call(this, urlsMatched, null, this);
      } else {
        this.$render()
      }    
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