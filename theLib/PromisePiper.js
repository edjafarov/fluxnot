var Promise = require('es6-promise').Promise;
var parse = require("parse-stack");

function PromisePiper(sequence){
  sequence = sequence || []
  var rec = [];

  var result = function(data, context){
    if(!PromisePiper.prod) rec.push([JSON.stringify(data),JSON.stringify(context)])
    var chain = [].concat(sequence);
    chain = chain.map(bindTo(context).bindIt.bind(result));
    return doit(chain, data);
  }
  
  result.then = function(){
    sequence.push([].slice.call(arguments));
    return result;
  }
  result.catch = function(fn){
    fn.isCatch = true;
    sequence.push([fn]);
    return result;
  }
  result.join = function(){
    var pipers = [].slice.call(arguments);
    var sequences = pipers.map(function(pipe){
      return pipe._getSequence();
    });
    var newSequence = sequence.concat.apply(sequence, sequences);
    return PromisePiper(newSequence);
  }

  result._getSequence = function(){
    return sequence;
  }
  result._getRec = function(){
    return rec;
  }  

  result = Object.keys(PromisePiper.transformations).reduce(function(thePipe, name){
    thePipe[name] = function(){
      var args = [].slice.call(arguments);
      sequence.push([function(data, context){
        var argumentsToPassInside = [data, context].concat(args);
        return PromisePiper.transformations[name].apply(result, argumentsToPassInside);
      }]);
      return result;
    }
    return thePipe;
  }, result);

  return result;
}

PromisePiper.transformations = {};

PromisePiper.use = function(name, transformation){
  PromisePiper.transformations[name] = transformation;
}

function doit(sequence, data){
  return sequence.reduce(function(doWork, funcArr){
    if(funcArr[0] && funcArr[0].isCatch) return doWork.catch.apply(doWork, funcArr); //do catch or
    return doWork.then.apply(doWork, funcArr);
  }, Promise.resolve(data))
}

function bindTo(that){
  return {
    bindIt: function bindIt(handlers){
      var result = this;
      return handlers.map(function(argFunc){
        //TODO: maybe it should be optimized for prod
        if(!PromisePiper.prod) {
          var newArgFunc = function(data){
            try{
              var newFunc = argFunc.call(this, data, that);
            } catch(e) {
              var parsed = parse(e);
              var rec = result._getRec();
              var msgObject = {
                pipeArgs:{
                  data: rec[rec.length - 1][0],
                  context: rec[rec.length - 1][1]
                },
                name: parsed[0].name,
                filepath: parsed[0].filepath,
                lineNumber: parsed[0].lineNumber,
                columnNumber: parsed[0].columnNumber,
                data: data,
                context: that,
                message: e.message,
                parsedStack: parsed,
                originalError: e,
                originalFunction: argFunc.toString()
              }
              console.error("PromisePipe Error: ");
              console.error(msgObject);
              Promise.reject(msgObject);
            }
            return newFunc;
          }
        } else {
          var newArgFunc = function(data){
            return argFunc.call(this, data, that);
          }
        }
        Object.keys(argFunc).reduce(function(funObj, key){
          funObj[key] = argFunc[key]
        }, newArgFunc); 
        return newArgFunc; 
      })
    }
  }
}

module.exports = PromisePiper;


/*
PromisePiper.use('logUrl', function(data, context, url){
  console.log(url,data);
  return data;
})
PromisePiper.use('log', function(data, context){
  console.log(data);
  return data;
})



var pipe = PromisePiper()
.logUrl("http://test")
.then(function(data, context){

data++;
return data
})
.then(function(data){

data++
data+t.t

return data
})
.then(function(data){
data++
return data
})
.then(function(data){
data++
return data
}).log()
pipe(5, {});

//console.log(pipe._getRec())
/*
var pipe1 = PromisePiper()
.then(function(data, context){
  console.log(data + "*2", context);
  return data * 2;
})
.then(function(data, context){
  console.log(data + "+1");
  context.test+=1;
  return data + 1;
})
.then(function(data){
  return new Promise(function(resolve, reject){
    console.log("thinking...");
    setTimeout(function(){

      resolve(data)
    }, 500);
  })
})
.then(function(data, context){
  console.log("=" + data)
  console.log(data, context)
});

pipe1(5,{test:1})

var pipe2 = PromisePiper()
.then(function(){
  console.log("end")
})

pipe3 = pipe1.join(pipe2)

pipe3(5,{})

*/











