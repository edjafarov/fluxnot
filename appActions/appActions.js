var PromisePiper = require("../theLib/PromisePiper");
var ActionsRouter = require("../theLib/ActionsRouter");
var Emitter = require('events').EventEmitter;

var doSpecificAction = ActionsRouter();

require("./UserFormActions")(doSpecificAction);

var ActionsEmitter = new Emitter();

var ActionPipe = PromisePiper()
.then(function(data){
	console.log("Action:" + this.actionName, data);
	return data;
})
.then(doSpecificAction)
.catch(function(err){
	console.log("ERROR: ", err);
})


module.exports = Object.create(new Emitter(), {
	doAction: {
		value: function(name, data, context){
			context = context || {};
			
			context.actionName = name;
			context.emit = module.exports.emit.bind(module.exports);

			ActionPipe.call(context, data);
		}
	},
	actionPipe: {
		value: ActionPipe
	}
});

