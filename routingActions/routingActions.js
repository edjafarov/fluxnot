module.exports = function(){
  var routingActions = require("../theLib/Actions")();
  var FluxNot = require('../theLib/FluxNot');

  require("./users/UsersActions")(routingActions.actionsRouter);

  routingActions.actionsPipe
  .then(log)
  .then(renderIfClient)
  .then(routingActions.actionsRouter)
  .then(renderIfServer)
  .then(log)
  .catch(logErrorAction)


  var clientRederedOnce = false;

  function renderIfClient(data){
    if(FluxNot.isClient && clientRederedOnce && this.path) {
      this.render();
      clientRederedOnce = true;
    }
    return data;
  }

  function renderIfServer(result){
    if(this.path && (!FluxNot.isClient || !clientRederedOnce)) {
      if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
      this._emitted = true;
      this.render();
    }
    return result;
  }


  function log(data){
    
    if(this.path){
      console.log(["Url Action, path:", this.path].join(''));
      if(this.query) console.log(["            query:", JSON.stringify(this.query)].join(''));
      if(this.params) console.log(["            params:", JSON.stringify(this.params)].join(''));
    } else {
      console.log("Log:", data, this);
    }
    return data;
  }


  function logErrorAction(data){
    console.log("ERROR:", this.actionName, data);
    return data;
  }

return routingActions;
}


