var Emitter = require('events').EventEmitter;

var isClient = true;
try{
  document 
}catch(e){
  isClient = false;
}



module.exports = function createApp(options){
	if(!options.router) throw new Error("Router should be defined");
	
	var ctx = initContext();

	function initContext(){
		var ctx = {
			stores:{},
			actions: new Emitter()
		}
		var ctx = Object.keys(options.stores).reduce(function(context, factoryName){
			context.stores[factoryName] = options.stores[factoryName]();
			return context;
		}, ctx);
		
		Object.keys(ctx.stores).forEach(function(name){
			ctx.stores[name].init(ctx);
		});
		return ctx;
	}
	
	function handlerWrapper(cb, initNewContext){
		if(initNewContext){
			ctx = initContext();
		}
		return function(Handler, state){
			state.app = this;
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
    	return options.router.call(this, null, handlerWrapper(cb));
    },
    context: ctx,
    isClient: isClient,
		isServer: !isClient
  }
}
