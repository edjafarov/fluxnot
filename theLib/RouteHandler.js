var Emitter = require('events').EventEmitter;

var isClient = true;
try{
  document 
}catch(e){
  isClient = false;
}



module.exports = function createApp(options){
	var stores = {};

	if(!options.router) throw new Error("Router should be defined");
	
	var ctx = initContext();

	function initContext(){
		var ctx = {
			stores:{},
			actions: new Emitter()
		}
		Object.keys(stores).reduce(function(context, name){
			context.stores[name] = initStore.call(ctx, stores[name]);
			return context;
		}, ctx);

		return ctx;
	}

	function initStore(storeFactory){
		var store = storeFactory.call(this, this);
		store.init();
		return store;
	}
	
	function handlerWrapper(cb, initNewContext){
		if(initNewContext){
			ctx = initContext();
		}
		var that = this;
		return function(Handler, state){
			state.app = this;
			state = Object.keys(ctx).reduce(function(context, name){
				context[name] = ctx[name];
				return context;
			}, state);
			if(that.request) state.request = that.request;
			cb.call(state, Handler, state);
		}
	}

	
  //hang on the historyAPI
  //init actions/routeActions/stores
  //each handler render with theese stores/actions/routes
  return {
    renderUrl: function renderUrl(req, cb){
      //create new actions/stores bind them to handler to render
      // context generation done once here, should do it each renderUrl and once initApp
      options.router.call(this, req.originalUrl, handlerWrapper.call({request: req}, cb, true));
    },
    initApp: function initApp(cb){
    	if(!isClient) return;
    	return options.router.call(this, null, handlerWrapper(cb));
    },
    context: ctx,
    isClient: isClient,
		isServer: !isClient,
		whenClient: function(handler){
			if(isClient) handler.call(this);
		},
		use: function(as, store){
			stores[as] = store;
			ctx.stores[as] = initStore.call(ctx, store);
		}
  }
}

module.exports.isClient = isClient;
module.exports.isServer = !isClient;