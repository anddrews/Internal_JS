// 'use strict';
// var STKit = require('./stkkit');
// ";key,value;methodName,|return true|;" => { key: 'value',  method: function() {return true;} }
// ";key,value;methodName,|function (a) { return a + 1; }|;" => { key: 'value',  method: function(a) {return a + 1;} }
var data1 = ';methodName1,|return true;|;methodName,|function (a,r,f,t) { return a + 1; }|;'+
'key,value;key1,value;arrayHere:k1,v1;k2,v2;k3,v3;key3,value3';
// prepareStrToParse(data1);

var k=parseToObj(data1);
k.newObj={a:3};
function prepareStrToParse(str) {
  var patternComm=/\([^\)]*\)/g;
  var patternSemCol=/\|[^\;]{1}[^\|]*\|/g;
  var outStr;
  var len;
  while((outStr=patternComm.exec(str))){
    len=outStr[0].length;
    outStr[0]=outStr[0].replace(/,/g,'!!!!!');
    str=str.split('');
    str.splice(outStr.index,len,outStr[0]);
    str=str.join('');
  } 
  while((outStr=patternSemCol.exec(str))){
    len=outStr[0].length;
    outStr[0]=outStr[0].replace(/;/g,'!!!');
    str=str.split('');
    str.splice(outStr.index,len,outStr[0]);
    str=str.join('');
  } 
  return str;
}
// console.log(objStringyFy(k,objDebehaviorizer));

function objStringyFy(obj,callBack) {
  var result='{';
  if(callBack!==undefined){
    obj=callBack.call(this,obj);
  }
  for(var prop in obj){
    if(obj.hasOwnProperty(prop)){
      if(typeof obj[prop]!='object'){
        result+=prop+ ',' + obj[prop]+';';
      }
      else{
        result+=prop+','+objStringyFy(obj[prop]);
      }
    }
  }
  result+='}';
  return result;
}






// console.log(parseToObj(data1));
var t=memoizeArbitrary(parseToObj);
var f=memoizeArbitrary(factorial);
// console.log(memoizeArbitrary(fibonacci)(3));
// console.log(memoizeArbitrary(fibonacci)(3));
// console.log(memoizeArbitrary(fibonacci)(3));
// console.log(t(5,5,5));
// console.log(f(3));
// console.log(f(4));
// console.log(f(4));
// console.log(t(data1));
// console.log(t(data1));
// console.log(t(data1));
// console.log(isLikeArray(3));
// console.log(isLikeArray(3,4,5));
// console.log(isLikeArray(data1));
// console.log(isLikeArray(factorial));


function factorial(n) {
    var res = 1;
    while(n !== 1) {
        res *= n--;
    }
    return res;
}



var fibonacci = (function() {
  var memo = {};

  function f(n) {
    var value;

    if (n in memo) 
    {
      value = memo[n];
    }
    else {
      if (n === 0 || n === 1)
      {
        value = n;
      }
      else
      {
        value = f(n - 1) + f(n - 2);
      }

      memo[n] = value;
    }

    return value;
  }

  return f;
})();


/* Parse any string to object*/
  function makeObj(str) {
    str=prepareStrToParse(str);
    var inputSplit=str.split(';');
    var output={};
    for (var i = 0; i < inputSplit.length; i++) {
      var partSplit=inputSplit[i].split(',');
      if(partSplit[0]!=='')
        {
          if(partSplit[1].indexOf('|')>=0){
            partSplit[1]=partSplit[1].replace(/!!!!!/g,',');
            partSplit[1]=partSplit[1].replace(/!!!/g,';');
            output[partSplit[0]]=newFunction(partSplit[1]);
          }
          else{
            output[partSplit[0]]=partSplit[1];            
          }
        }
    }
    return output;
  }

  function parseToObj(str) {
    var index;
    var strToArray;
    var keyArr;
    var propArr=[];
    var arrOfObj=[];
    var output;    
    if(str.indexOf(':')<0){
      output=makeObj(str);
    }
    else
    {
      index=str.substring(0,str.indexOf(':')).lastIndexOf(';');
      output=makeObj(str.substring(0,index));
      strToArray=str.substring(index+1,str.length).split(':');
      keyArr=strToArray[0];
      arrOfObj=strToArray[1].split(';');
      for (var i = 0; i < arrOfObj.length; i++) {
        var key=arrOfObj[i].substring(0,arrOfObj[i].indexOf(','));
        var value=arrOfObj[i].substring(arrOfObj[i].indexOf(',')+1,arrOfObj[i].length);
        propArr[i]={};
        propArr[i][key]=value;
      }
      output[keyArr]=propArr;
    }
    return output;
  }


// function memoizeOnce(arg) {
//   var memo={};
//   var result={};
//   return function(){

//   };
// }

function memoizeArbitrary(func) {
  var memo = {};
  var result;

  return function() {
    var args = Array.prototype.slice.call(arguments);
    if (args in memo)
    {
      result = memo[args];
    }
    else if (typeof func=='function'){
      result = func.apply(this,args);
      memo[args]=result;
    }
    else 
    {
      result='argument is not a function';
    }
    return result;
  };
}



var rrr={};
rrr=parseToObj(data1);
rrr.arrayHere[3]=fibonacci;
rrr.func=memoizeArbitrary;
rrr.func1=fibonacci;
rrr.obj={a:1,b:2,c:parseToObj};
rrr.obj2=[factorial,memoizeArbitrary,{3:3},4,5,6];
// var eee=objDebehaviorizer(rrr,true);

// console.log(STKit.objDebehaviorizer(rrr,true));

behaviorizer(rrr,k);
console.log(k);

// var eee=dabehaviorizer(rrr,true);
// console.log('result of function');
// console.log(eee);
// console.log('end object');
// console.log(rrr);

 function objDebehaviorizer(obj) {
  var isSeparate=arguments[1];
  if(isSeparate)
  {    
    return deleteProperty(obj);
  }
  else
  {
    var objCopy=clone(obj);
    deleteProperty(objCopy);
    return objCopy;
  }
 }

 function deleteProperty(currObj) {
  var behaveArr=[];  
  for(var prop in currObj)
    {
    if(typeof currObj[prop]=='function')
      {
        behaveArr=behaveArr.concat(currObj[prop]);
        if(Object.getOwnPropertyDescriptor(currObj,prop)['configurable']) 
        {
          delete currObj[prop];                 
        }
        else
        {
          throw new Error('The property '+ prop + ' is non-configurable');
        }
      }
      else if(typeof currObj[prop]=='object')
      {
        behaveArr=behaveArr.concat(deleteProperty(currObj[prop]));
      }
    }
  return behaveArr;
 }
 

function clone(cloneObj) {
  if (!(cloneObj instanceof Object)) {
    return cloneObj;
  } 
  var objectClone; 
  var Constructor = cloneObj.constructor;
  objectClone = new Constructor();
  for (var prop in cloneObj) {
    if (cloneObj.hasOwnProperty(prop)) 
    {
      objectClone[prop] = clone(cloneObj[prop]);
    }
  }
  
  return objectClone;
}


function behaviorizer(obj,obj1) {
  if(typeof obj1=='object')
  {
    var arrBehav=objDebehaviorizer(obj,true);
    console.log(arrBehav);
    for (var i = 0; i < arrBehav.length; i++) {
      obj1[arrBehav[i].name]=arrBehav[i];
    }
  }
  else{
    throw new Error('Can not add behave into obj');
  }
}


// ";key,value;methodName,|return true|;" => { key: 'value',  method: function() {return true;} }
// ";key,value;methodName,|function (a) { return a + 1; }|;" => { key: 'value',  method: function(a) {return a + 1;} }
// console.log( newFunction('|function (a) { return a + 1; }|'));
function newFunction(str) {
  var isExistParameters=/\|function.*\((.*)\)/g;
  var bodyFunc;
  var param=['',''];
  var tmp;
  var func;
  if((tmp=isExistParameters.exec(str))){
    param=tmp;
    bodyFunc=/{(.*)}/.exec(str);    
  }
  else{
    bodyFunc=/\|(.*)\|/.exec(str);
  }
  func=new Function(param[1],bodyFunc[1]);
  func.name='fghfg';
  return func;
}