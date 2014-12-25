var PromisePiper = require("./PromisePiper");
var ActionsRouter = require("./ActionsRouter");
var Emitter = require('events').EventEmitter;


var ActionsEmitter = new Emitter();



module.exports = function(){

	var doSpecificAction = ActionsRouter();
	var ActionPipe = PromisePiper();

	var actionObject = Object.create(new Emitter(), {
		doAction: {
			value: function(name, data, context){
				context = context || {};
				if(this.context){
					context = Object.keys(this.context).reduce(function(ctx, name){
						ctx[name] = this.context[name];
						return ctx;
					}.bind(this), context)
				}
							
				context.actionName = name;
				context.emit = actionObject.emit.bind(actionObject);

				ActionPipe.call(context, data);
			}
		},
		actionsPipe: {
			value: ActionPipe
		},
		actionsRouter: {
			value: doSpecificAction
		},
		init: {
			value: function(ctx){
				this.context = ctx;
			}
		}
	});
	return actionObject;
}

