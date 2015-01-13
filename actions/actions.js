var PromisePiper = require('../theLib/PromisePiper');
var Resource = require('../theLib/Resource');
var Validators = require('../Validators');

PromisePiper.use('get', Resource.get);
PromisePiper.use('post', Resource.post);
PromisePiper.use('put', Resource.put)
PromisePiper.use('emit', function emit(data, context, eventName){
	context.emit(eventName, data);
});

PromisePiper.use('validate', Validators.tv4)

module.exports = {
	users: require("./users")
}




