var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var Promise = require('es6-promise').Promise;
var RouteHandler = require('./theLib/RouteHandler');
var ReactRouterAdapter = require("./theLib/ReactRouterAdapter");

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
  router: ReactRouterAdapter.routerAdapter(routes)
};


//Read Template
if(RouteHandler.isServer) var indexTemplate = require('fs').readFileSync("./index.html")

var appActions = require("./appActions/appActions")();


ReactRouterAdapter.parseActions(routes).forEach(function(route){
  appActions.actionsRouter.create(route.path, route.action);
})


var createApp = require("./theLib/RouteHandler");

var app = createApp(appCfg);

app.use('UserFormStore', require("./stores/UserFormStore"));
app.use('UserStore', require("./stores/UserStore"));
app.use('UsersStore', require("./stores/UsersStore"));





module.exports =  function(req, res){
  // render as HTML
  app.renderUrl(req.originalUrl, appHandler(function(){
    var renderedApp = React.renderToString(<this.Handler/>);
    res.end(indexTemplate.toString().replace('<body>','<body><div id="content">' + renderedApp + '<div>'));
  }));
}

//If client - init the app, on route change set up context and trigger routing actions
app.initApp(appHandler(function(){
  React.render(<this.Handler/>, document.getElementById('content'));
}));




function appHandler(renderStuff){
  return function (Handler, state){
    state.$render = function(){
      state.routeAction = false;
      var doAction = appActions.withContext(state).doAction;
      React.withContext({doAction:doAction, stores: state.stores}, renderStuff.bind({Handler:Handler}));
    }
    var urlsMatched = this.routes.map(function(route){
      return route.path;
    });
    this.routeAction = true;
    if(urlsMatched.length > 0){
      appActions.doAction.call(this, urlsMatched, null, this);
    } else {
      this.$render()
    }    
  }
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