var Emitter = require('events').EventEmitter;
function Store(){

}

Store.create = function create(base){
	base = Object.keys(base).reduce(function(context, name){
		context[name] = {
			configurable: false,
			enumerable: false,
			writable: false,
			value: base[name]
		}
		return context;
	},{});
	return Object.create(new Emitter, base);
}


module.exports =  Store;