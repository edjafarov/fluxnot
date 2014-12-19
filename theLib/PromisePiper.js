var Promise = require('es6-promise').Promise;

function PromisePiper(){
  var sequence = []

  var result = function(data){
    var chain = [].concat(sequence);
    chain = chain.map(bindTo(this).bindIt); 
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
  return result;
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
      return handlers.map(function(argFunc){
        var newArgFunc = argFunc.bind(that);
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
var pipe1 = PromisePiper()
.then(function(data){
  console.log(data + "*2");
  return data * 2;
})
.then(function(data){
  console.log(data + "+1");
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
.then(function(data){
  console.log("=" + data)
  console.log(data)
});

pipe1(5)*/
