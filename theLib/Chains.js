var clientRederedOnce = false;
var RouteHandler = require('./RouteHandler');

module.exports = {
	renderIfClient: function renderIfClient(data){
    if(RouteHandler.isClient && clientRederedOnce && this.path && this.routeAction) {
      this.$render();
      clientRederedOnce = true;
    }
    return data;
  },
	renderIfServer: function renderIfServer(data){
    if(this.path && this.routeAction &&  (!RouteHandler.isClient || !clientRederedOnce)) {
      if(this._emitted) throw new Error("Action could not be finalized twice: " + actionName);
      this._emitted = true;
      try{
        this.$render();
      } catch (e){
        console.log(e)
      }
      
    }
    return data;
  }
}



  

  
