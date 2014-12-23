var PromisePiper = require("../theLib/PromisePiper");
var ActionsRouter = require("../theLib/ActionsRouter");
var Emitter = require('events').EventEmitter;
var FluxNot = require('../theLib/FluxNot');
var Promise = require('es6-promise').Promise;

var doSpecificAction = ActionsRouter();

require("./users/UsersActions")(doSpecificAction);

var ActionPipe = PromisePiper()
.then(log)
.then(renderIfClient)
.then(doSpecificAction)
.then(renderIfServer)
.then(log)
.catch(function(){
  console.log(arguments, "ERROR!!!!");
})


var clientRederedOnce = false;

function renderIfClient(data){
  console.log(FluxNot.isClient && clientRederedOnce && this.path);
  if(FluxNot.isClient && clientRederedOnce && this.path) {
    this._render();
    clientRederedOnce = true;
  }
  return data;
}

function renderIfServer(result){
  if(this.path && (!FluxNot.isClient || !clientRederedOnce)) {
    if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
    this._emitted = true;
    this._render();
  }
  return result;
}


function log(data){
  console.log(this.app.transitionTo);
  if(this.path){
    console.log(["Url Action, path:", this.path].join(''));
    if(this.query) console.log(["            query:", JSON.stringify(this.query)].join(''));
    if(this.params) console.log(["            params:", JSON.stringify(this.params)].join(''));
    console.log("Context: ", this);
  } else {
    console.log("Log:", data, this);
  }
  return data;
}




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

