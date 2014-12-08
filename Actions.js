var Promise = require('es6-promise').Promise;
var Emitter = require('events').EventEmitter;


var Actions = {
  _end: function end(result){
    if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
    this._emitted = true;
    this.emit(this.actionName, result);
  },
  actionRouter: "actionRouter",
  _sequence: [],
  use: function(){
    Actions._sequence.push([].slice.call(arguments));
  },
  create: function(actionName){
    var sequence = [].concat(Actions._sequence);
    var actionRouterIndex = -1;
    var isStrict = false;

    sequence.forEach(function(args, i){
      if(args[0] == Actions.actionRouter) actionRouterIndex = i;
    });
    if(!!~actionRouterIndex) {
      sequence.splice(actionRouterIndex, 1);
    } else {
      actionRouterIndex = sequence.length -1;
    }
    sequence.push([function finish(){
      this.end.apply(this, arguments);
    }]);    
    
    Actions[actionName] = function(params, data){
      
      params._emitted = false;
      params.end = Actions._end;

      params.emit = Actions.emit.bind(Actions);
      params.actionName = actionName;

      var res = sequence.reduce(function(dostuff, func){
        func = func.map(function(funcArg){
          return funcArg.bind(params);
        });
        return dostuff.then.apply(dostuff, func);
      }, Promise.resolve(data));
    };
    var self = {
      then: function(){
        sequence.splice(actionRouterIndex, 0, [].slice.call(arguments));
        return self;
      },
      strict: function(strict){
        isStrict = strict;
      }
    };
    return self;
  },
  
  doAction: function(actionName){
    var arg = [].slice.call(arguments);
		Actions[arg.shift()].apply(this, arg);
	}
};
Actions.__proto__ = new Emitter();
module.exports = Actions;

