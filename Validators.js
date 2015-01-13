var tv4 = require('tv4');

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
	},
	tv4: function validate(data, context, schema){
		var isValid = tv4.validate(data, schema);
		if(!isValid) return Promise.reject(tv4.error);
		return data;
	}
}