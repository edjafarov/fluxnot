var Router = require('react-router');
var Route = Router.Route;
var React = require('react');
var isClient = false;
/* need routes to be defined */
// index template need to be defined
// static middleware should be enabled before
// need actions to be defined
// client Main should export routes and actions

function createServerMiddleware(options){
	isClient = false;
	if(!options.indexTemplate) throw new Error("indexTemplate option should be defined");
	if(!options.routes) throw new Error("routes option should be defined");
	if(!options.Actions) throw new Error("Actions option should be defined");

  var indexTemplate = options.indexTemplate.toString();
  return function renderReactServer(req, res, next){
    Router.run(options.routes, req.originalUrl, function (Handler, state) {
      state._render = function(){
      	console.log("RENDER");
        var renderedApp = React.renderToString(<Handler/>);
        res.end(indexTemplate.replace('<body>','<body><div id="content">' + renderedApp + '<div>'));
      }    
      var urlsMatched = state.routes.map(function(route){
      	return route.path;
      }).reduce(function(res, path){
      	if(options.Actions[path]) res.push(path);
      	return res;
      },[]);
      if(urlsMatched.length == 1) { //matched URL
        options.Actions.doAction(urlsMatched[0], state);
      } else if(urlsMatched.length > 1){
      	options.Actions.doActions(urlsMatched, state);
      }else{
        state._render(); // or Actions.doAction('/404', state);
      }
    });
  }
}

function renderIfClient(data){
  if(isClient && clientRederedOnce && this.path) this._render();
  return data;
}
/* TODO: check error handling for server rendering */
function renderIfServer(result){
  if(this.path && (!isClient || !clientRederedOnce)) {
    this.end = function end(result){
      if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
      this._emitted = true;
      this.emit(this.actionName, result);
      this._render();
    }
  }
  return result;
}


var clientRederedOnce = false;

function createClient(options){
	isClient = true;
	if(!options.routes) throw new Error("routes option should be defined");
	if(!options.Actions) throw new Error("Actions option should be defined");
//, Router.HistoryLocation
	Router.run(options.routes,Router.HistoryLocation ,function (Handler, state) {
	  state._render = function(){
	  	clientRederedOnce = true;
	    return React.render(<Handler/>, document.getElementById('content'));
	  }
    var urlsMatched = state.routes.map(function(route){
    	return route.path;
    }).reduce(function(res, path){
    	if(options.Actions[path]) res.push(path);
    	return res;
    },[]);
    
    if(urlsMatched.length == 1) { //matched URL
      options.Actions.doAction(urlsMatched[0], state);
    } else if(urlsMatched.length > 1 && !clientRederedOnce){
    	options.Actions.doActions(urlsMatched, state);
    } else if(urlsMatched.length > 1 && clientRederedOnce){
    	options.Actions.doAction(urlsMatched[urlsMatched.length - 1], state);
    }else{
      state._render(); // or Actions.doAction('/404', state);
    }	  
	});
}

function multifetchMiddleware(){

}



module.exports ={
	isClient: isClient,
	server: {
		createServer: createServerMiddleware,
		multifetchMiddleware: multifetchMiddleware
	},
	client: {
		createClient: createClient,
		renderIfServer: renderIfServer,
		renderIfClient: renderIfClient
	}
}