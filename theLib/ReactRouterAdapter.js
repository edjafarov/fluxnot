var Router = require('react-router');

module.exports = {
	parseActions: parse,
	routerAdapter: function(routes){
		return function (url, cb){ // the router accepts url and cb
	    if(url){
	      // pass the url if defined
	      return Router.run(routes, url, cb);
	    } else {
	      // set up the router listener for browser
	      return Router.run(routes, Router.HistoryLocation, cb);
	    }
	  }
	}
}

function parse(routes){
	var acts = [];
	parseActions(routes);
	function parseActions(comp, path){
	  if(!comp.props) return;
	  var result = {};
	  if(comp.props.path) {
	    result.path = path + "/" + comp.props.path; 
	  }
	  if(comp.props.name){
	    result.name = comp.props.name;
	  }
	  if(comp.props.action){
	    result.action = comp.props.action;
	  }
	  if(comp.props.children) {
	  	if(comp.props.children instanceof Array){
	  		comp.props.children.forEach(function(child){
	  			parseActions(child, result.path || '');	
	  		});
	  	}else{
	  		parseActions(comp.props.children, result.path || '');
	  	}
	  	
	  }

	  if(!result.path) result.path = "/";
	  acts.push(result);
	}
	return acts;
}