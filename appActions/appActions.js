var RouteHandler = require('../theLib/RouteHandler');
var Chains = require('../theLib/Chains');

module.exports = function(){
		// create instance of appActions
	var appActions = require("../theLib/Actions")();

	//add actionSpecific behavior
	require("./UserFormActions")(appActions.actionsRouter);

	//add common actions behavior
	appActions.actionsPipe

	//log before
	.then(log) 
  // render if is rendering on client
  .then(Chains.renderIfClient)
	//do real specific actions
	.then(appActions.actionsRouter)

  // render if rendering on server
  .then(Chains.renderIfServer)	
	//catch errors after
	.catch(logErrorAction) 


  

  function log(data){
    
    if(this.path){
      console.log(["Url Action, path: ", this.path, " Action Name: ", this.actionName].join(''));
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
