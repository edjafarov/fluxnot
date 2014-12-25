var Promise = require('es6-promise').Promise;
var PromisePiper = require('./PromisePiper');


function getRouter(){
  var routes = {};
  var actionsRouter = function(data){
    var actionNames = this.actionName instanceof Array?this.actionName:[this.actionName];
    var that = this;
    var promises = actionNames.reduce(function(promises, actionName){
      if(routes[actionName]) promises.push(routes[actionName].call(that, data));
      return promises; 
    }, []);

    var result = promises.length>0?Promise.all(promises):Promise.resolve(data);
    return result;
  }

  actionsRouter.create = function(name){
    routes[name] = PromisePiper();
    return routes[name];
  }  
  return actionsRouter;
}

module.exports = getRouter;










