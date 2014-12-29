var FluxNot = require('../theLib/FluxNot');

module.exports = function(){
		// create instance of appActions
	var appActions = require("../theLib/Actions")();

	//add actionSpecific behavior
	require("./UserFormActions")(appActions.actionsRouter);

	//add common actions behavior
	appActions.actionsPipe

	//log before
	.then(log) 
  .then(renderIfClient)
	//do real specific actions
	.then(appActions.actionsRouter)
  .then(renderIfServer)	
	//catch errors after
	.catch(logErrorAction) 


  var clientRederedOnce = false;

  function renderIfClient(data){
    if(FluxNot.isClient && clientRederedOnce && this.path) {
      this.$render();
      clientRederedOnce = true;
    }
    return data;
  }

  function renderIfServer(result){
    if(this.path && (!FluxNot.isClient || !clientRederedOnce)) {
      if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
      this._emitted = true;
      try{
        this.$render();
      } catch (e){
        console.log(e)
      }
      
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


	return appActions;
};
/*
Usage: 
 - run actions
		//actionName - name or [<names>]
		//data - data to pass to action
		//context - conext to run action chain
		appActions.doAction(actionName, data, context)

 - create actions
 		//actionName - name of action
 		//dostuffN - handlers, may return Promises
 		appActions.actionsRouter.create(actionName)
 		.then(dostuff1)
 		.then(dostuff2)
 		.then(dostuff3)
 		.then(dostuff4)
 		.catch(handleSomeError)
*/
