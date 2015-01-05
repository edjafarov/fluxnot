var request = require('superagent');
var hostname = process.env.HOSTNAME || "";
var path = require("path");
var Promise = require('es6-promise').Promise;


function prepreUrl(url){
	return Object.keys(this.params).reduce(function(urlString, name){

		urlString = urlString.replace(new RegExp("\\/(:" + name + ")(\\/|$)","g"), ["/", this.params[name], "/"].join(""));
		console.log(urlString, name, this.params[name]);
		urlString = urlString.replace(/\/$/, "");
		return urlString;
	}.bind(this), url);
}

module.exports = function Resource(){
	return ['get','head','del','patch','post','put'].reduce(function(req, name){
		var old = req[name];
		req[name] = function(){
			var args = arguments;
			args[0] = [hostname, args[0]].join("");
			console.log(args[0], hostname);
			return old.apply(this, args);
		}
		return req;
	}, request);
}

var resource = module.exports();

module.exports.get = function(url, query){
	return function(data){

		return new Promise(function(resolve, reject){
			var req = resource.get(prepreUrl.call(this, url));
			if(this.request && this.request.headers){
				req.set(this.request.headers);
			}
			
			if(typeof(query) == 'function') {
				req.query(query.call(this, data));
			} else if(typeof(query) == 'object'){
				req.query(query);
			}
			req.on('error', function(err){
				reject(err);
			})
			req.end(function(res){
				if(res.error) return reject(res.error);
				resolve(res.body);
			})
		}.bind(this));
	};
}

module.exports.post = function(url, body, query){
	return function(data){
		
		return new Promise(function(resolve, reject){
			var req = resource.post(prepreUrl.call(this, url));
			if(this.request && this.request.headers){
				req.set(this.request.headers);
			}			
			if(query && typeof(query) == 'function') {
				req.query(query.call(this, data));
			} else if(query && typeof(query) == 'object'){
				req.query(query);
			}

			if(body && typeof(body) == 'function'){
				req.send(body.call(this, data));
			} else if(body && typeof(body) == 'object'){
				req.send(body);
			} else if(body && typeof(body) == 'string') {
				req.send(data[body]);
			} else if(!body && data){
				req.send(data);
			}

			req.on('error', function(err){
				reject(err);
			})
			req.end(function(res){
				if(res.error) return reject(res.error);
				resolve(res.body);
			})
		}.bind(this));
	};
}

module.exports.put
 = function(url, body, query){
	return function(data){
		
		return new Promise(function(resolve, reject){
			var req = resource.put(prepreUrl.call(this, url));
			if(this.request && this.request.headers){
				req.set(this.request.headers);
			}			
			if(query && typeof(query) == 'function') {
				req.query(query.call(this, data));
			} else if(query && typeof(query) == 'object'){
				req.query(query);
			}

			if(body && typeof(body) == 'function'){
				req.send(body.call(this, data));
			} else if(body && typeof(body) == 'object'){
				req.send(body);
			} else if(body && typeof(body) == 'string') {
				req.send(data[body]);
			} else if(!body && data){
				req.send(data);
			}

			req.on('error', function(err){
				reject(err);
			})
			req.end(function(res){
				if(res.error) return reject(res.error);
				resolve(res.body);
			})
		}.bind(this));
	};
}

/*
resource.get("/api/users").end(function(res){
  console.log(res.body);
})
*/