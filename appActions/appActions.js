module.exports = function(){
		// create instance of appActions
	var appActions = require("../theLib/Actions")();

	//add actionSpecific behavior
	require("./UserFormActions")(appActions.actionsRouter);

	//add common actions behavior
	appActions.actionsPipe

	//log before
	.then(logAction) 

	//do real specific actions
	.then(appActions.actionsRouter)
	
	//catch errors after
	.catch(logErrorAction) 


	function logAction(data){
		console.log("Action:", this.actionName, data, this);
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
