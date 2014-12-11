var Promise = require('es6-promise').Promise;
var Emitter = require('events').EventEmitter;


var Actions = {
  _end: function end(result){
    if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
    this._emitted = true;
    console.log(this.actionName + ":END", result);
    this.emit(this.actionName, result);
  },
  _catch: function catchfun(error){
    if(this._emitted) throw new Error("Action could not be finalized/catched twice: " + actionName);
    this._emitted = true;
    console.log(this.actionName + ":rejected:END", error);
    this.emit(this.actionName + ":rejected", error);
  },
  actionRouter: "actionRouter",
  _sequence: [],

  use: function(){
    Actions._sequence.push([].slice.call(arguments));
  },
  catch: function(fn){
    fn.isCatch = true;
    Actions._sequence.push([fn]);
  },  
  create: function(actionName){
    var sequence = [].concat(Actions._sequence);
    var actionRouterIndex = -1;
    var actionChainLength = 0;
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
    function catchfinal(){
      this.catch.apply(this, arguments);
    }
    catchfinal.isCatch = true;
    sequence.push([catchfinal]);    
    
    Actions[actionName] = function(params, data){
      
      params._emitted = false;
      params.end = Actions._end;
      params.catch = Actions._catch;

      params.emit = Actions.emit.bind(Actions);
      params.actionName = actionName;

      var res = sequence.reduce(function(dostuff, func){
        func = func.map(function(funcArg){
          var isCatch = funcArg.isCatch;
          var res = funcArg.bind(params);
          res.isCatch = isCatch;
          return res;
        });
        if(func[0] && func[0].isCatch) return dostuff.catch.apply(dostuff, func);
        return dostuff.then.apply(dostuff, func);
      }, Promise.resolve(data));
    };

    Actions[actionName].getSequence = function getSequence() {
      return sequence.slice(actionRouterIndex, actionRouterIndex + actionChainLength);
    }

    var self = {
      then: function(){
        sequence.splice(actionRouterIndex + actionChainLength, 0, [].slice.call(arguments));
        actionChainLength++;
        return self;
      },
      catch: function(fn){
        fn.isCatch = true;
        sequence.splice(actionRouterIndex + actionChainLength, 0, [fn]);
        actionChainLength++;
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
	},

  doActions: function(actionNames, params, data){
    var sequence = [].concat(Actions._sequence);
    var actionRouterIndex = -1;
    var actionChainLength = 0;
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
    params._emitted = false;
    params.end = Actions._end;
    params.emit = Actions.emit.bind(Actions);
    params.actionName = actionNames[actionNames.length - 1];   
    sequence = sequence.map(function(handlers){
      return handlers.map(function(funcArg){
        var isCatch = funcArg.isCatch;
        var res = funcArg.bind(params);
        res.isCatch = isCatch;        
        return res;
      })
    });

    var subSequences = [];
    actionNames.forEach(function(actionName, i){
      var specificParams = {};

      specificParams.__proto__ = params;

      var subSequence = Actions[actionName].getSequence();

      specificParams._emitted = false;
      specificParams.end = Actions._end;

      specificParams.emit = Actions.emit.bind(Actions);
      specificParams.actionName = actionName;      
      subSequence = subSequence.map(function(handlers){
        return handlers.map(function(funcArg){
          var isCatch = funcArg.isCatch;
          var res = funcArg.bind(specificParams);
          res.isCatch = isCatch;        
          return res;          
        });
      });

      if(actionNames.length - 1 != i) {
        subSequence.push([function(result){
          this.end.apply(this, arguments);
          return result;
        }.bind(specificParams)])
      }
      subSequences = subSequences.concat(subSequence);

    });

    sequence.splice.apply(sequence, [actionRouterIndex + actionChainLength, 0].concat(subSequences));

    var res = sequence.reduce(function(dostuff, func){
      if(func[0] && func[0].isCatch) return dostuff.catch.apply(dostuff, func);
      return dostuff.then.apply(dostuff, func);
    }, Promise.resolve(data));
  }  
};


Actions.__proto__ = new Emitter();
module.exports = Actions;

