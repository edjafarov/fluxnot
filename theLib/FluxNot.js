var Router = require('react-router');
var Route = Router.Route;
var React = require('react');

var isClient = true;
try{
  document 
}catch(e){
  isClient = false;
}
/* need routes to be defined */
// index template need to be defined
// static middleware should be enabled before
// need actions to be defined
// client Main should export routes and actions

function getClientHandler(options){
	if(options.indexTemplate) options.indexTemplate = options.indexTemplate.toString();
	if(!options.routes) throw new Error("routes option should be defined");

	var routerHandler;
	function route(url, cb){
		if(!routerHandler){
			if(cb) return cb("routerHandler is not defined");
			throw new Error("routerHandler is not defined");
		}
		
		var app = Router.run(options.routes, url || Router.HistoryLocation ,function (Handler, state) {
		  state.app = this;
		  if(!cb){
			  state._render = function(){
			  	result.clientRenderedOnce = true;
			    return React.render(<Handler/>, document.getElementById('content'));
			  }
			} else {
				state._render = function(){
					if(!options.indexTemplate) throw new Error("indexTemplate option should be defined");
          var renderedApp = React.renderToString(<Handler/>);
	        cb(null, options.indexTemplate.replace('<body>','<body><div id="content">' + renderedApp + '<div>'));
				}
			}
			routerHandler.call(state);
		});
		return app;
	}
	var result = {
		doOnRoute: function(fn){
			routerHandler = fn;
		},
		middleware: function(req, res, next){
			return route(req.originalUrl, function(err, html){
				if(err) return next(err);
				res.end(html)
			});
		},
		route: route,
		clientRenderedOnce: false
	}
	return result;
}

getClientHandler.isClient = isClient;
getClientHandler.isServer = !isClient;

module.exports = getClientHandler;



function route(Handler, state){
	if(!cb){
	  this.render = function(){
	  	result.clientRenderedOnce = true;
	    return React.render(<Handler/>, document.getElementById('content'));
	  }
	} else {
		this.render = function(){
			if(!options.indexTemplate) throw new Error("indexTemplate option should be defined");
      var renderedApp = React.renderToString(<Handler/>);
      cb(null, options.indexTemplate.replace('<body>','<body><div id="content">' + renderedApp + '<div>'));
		}
	}
}


/*{
	isClient: isClient,
	server: {
		doOnRoute: createServerMiddleware.doOnRoute,
		createServer: createServerMiddleware,
		multifetchMiddleware: multifetchMiddleware
	},
	client: {
		doOnRoute: createClient.doOnRoute,
		createClient: createClient,
		renderIfServer: renderIfServer,
		renderIfClient: renderIfClient
	}
}


/*
function createServerMiddleware(options){
	isClient = false;
	if(!options.indexTemplate) throw new Error("indexTemplate option should be defined");
	if(!options.routes) throw new Error("routes option should be defined");

	var doArray = createServerMiddleware.doArray;
	options.routes.doOnRoute = function(func){
		doArray.push(func);
	}

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
      });

      if(urlsMatched.length > 0 && doArray.length > 0) { //matched URL
      	doArray.forEach(function(func){
					state.actionName = urlsMatched;
      		func.call(state);
      	});
      }else{
        state._render(); // or Actions.doAction('/404', state);
      }
    });
  }
}

createServerMiddleware.doArray = [];

createServerMiddleware.doOnRoute = function(func){
	createServerMiddleware.doArray.push(func);
}


function renderIfClient(data){
  if(isClient && clientRederedOnce && this.path) this._render();
  return data;
}
/* TODO: check error handling for server rendering *1/
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
	var doArray = createClient.doArray;

//, Router.HistoryLocation
	Router.run(options.routes, Router.HistoryLocation ,function (Handler, state) {
		console.log("ROUTER", arguments)
	  state._render = function(){
	  	clientRederedOnce = true;
	    return React.render(<Handler/>, document.getElementById('content'));
	  }
    var urlsMatched = state.routes.map(function(route){
    	return route.path;
    });
    console.log(urlsMatched.length > 0 , doArray.length > 0 ,clientRederedOnce)
		if(urlsMatched.length > 0 && doArray.length > 0 && !clientRederedOnce) { //matched URL
    	doArray.forEach(function(func){
				state.actionName = urlsMatched;
    		func.call(state);
    	});
    } else if(urlsMatched.length > 0 && doArray.length > 0 && clientRederedOnce){
    	doArray.forEach(function(func){
				state.actionName = urlsMatched[urlsMatched.length - 1];
    		func.call(state);
    	});
    }else{
      state._render(); // or Actions.doAction('/404', state);
    }	  
	});
}
createClient.doArray = [];

createClient.doOnRoute = function(func){
	createClient.doArray.push(func);
}
*/