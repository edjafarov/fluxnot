
var isClient = true;
try{
  document 
}catch(e){
  isClient = false;
}

var routes;
function router(url, cb){
	if(url){
		return Router.run(routes, url, cb);
	} else {
		return Router.run(routes, Router.HistoryLocation, cb);
	}
}

module.exports = function createApp(options){
	if(!options.router) throw new Error("Router should be defined");
	
	var ctx = initContext();

	function initContext(){
		var ctx = Object.keys(options.context).reduce(function(context, factoryName){
			context[factoryName] = options.context[factoryName]();
			return context;
		}, {});
		Object.keys(ctx).forEach(function(name){
			ctx[name].init(ctx);
		});
		return ctx;
	}
	
	function handlerWrapper(cb, initNewContext){
		if(initNewContext){
			ctx = initContext();
		}
		return function(Handler, state){

			state = Object.keys(ctx).reduce(function(context, name){
				context[name] = ctx[name];
				return context;
			}, state);

			cb.call(state, Handler, state);
		}
	}

	
  //hang on the historyAPI
  //init actions/routeActions/stores
  //each handler render with theese stores/actions/routes
  return {
    renderUrl: function renderUrl(url, cb){
      //create new actions/stores bind them to handler to render
      // context generation done once here, should do it each renderUrl and once initApp
      options.router.call(this, url, handlerWrapper(cb, true));
    },
    initApp: function initApp(cb){
    	options.router.call(this, null, handlerWrapper(cb));
    },
    context: ctx,
    isClient: isClient,
		isServer: !isClient
  }
}
