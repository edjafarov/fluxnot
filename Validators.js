module.exports = {
	isRequired:function isRequired(name){
	  return function(data){

	    if(!data[name] || data[name] == ""){
	      if(!this.errors) this.errors = []
	      this.errors.push({varName: name, type:"required"});
	    }
	    return data;
	  }
	},

	isLonger:function isLonger(name){
	  return {
	    then: function(then){
	      return function(data){

	        if(data[name] && data[name].length < then){
	          if(!this.errors) this.errors = []
	          this.errors.push({varName: name, type:"length is not ehough"});
	        }
	        return data;       
	      }
	    }
	  }
	}

}