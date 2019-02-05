var STKit=(function () {
	/**
     * Memoizer
     * This is function which will return memoized version of any given function which can take arbitrary arguments.
     *
     * @private
     * @param {Function} fun The function for memoization.
     * @returns {Function} Returns the memoized function which can take arbitrary arguments.
     */
	var memoizeArbitrary=function (func) {
		  var memo = {};
		  var result;
		  return function() {
		    var args = Array.prototype.slice.call(arguments);
		    if (args in memo) {
		      result = memo[args];
		    }
		    else if (typeof func=='function'){
		      result = func.apply(this,args);
		      memo[args]=result;
		    }
		    else {
		      result='argument is not a function';
		    }
		    return result;
		  };
	};
	/**
     * Is Array Like object checker.
     * This is function which will determine is given object array like or not.
     * If this is object have a parameter 'length' it's like array object.
     *
     * @private
     * @param {Object} obj The object for check like array or not.
     * @returns {boolean} Returns 'true' if 'obj' like array object, else return 'false'.
     */
	var	isLikeArray=function (obj) {
		if (obj.length && 		
			isFinite(obj.length) && 
			obj.length >= 0 && 
			obj.length===Math.floor(obj.length) && 
			obj.length < 4294967296) {
			return true;
		}
		else  {
			return false;
		}
	};

	/**
     * Object Debehaviorizer.
     * This is function which will receive object as argument, and remove any behavior related properties from it and
     * return the new object, don't change argument was inputed. 
     * Or mutate existing object and return array with all behavior in it depending on second boolean argument
     * which is supplied or not;
     * Error will thrown if object 'non configurable'.
     * The function can take one or two parameters.
     *
     * @private
     * @throws {Error} New error will thrown if object 'non configurable'.
     * @param {Object} obj The object for copy his properties without behavior to new object.
     * @param {boolean} isSeparate The boolean flag, only if it 'true' behavior will be copied from 'obj' to array,
     * @returns {Object} or {Array} dependence from isSeparate value, if separate = true, will return new Array 
     * with methods from object was inputed, and one will be non change, at other will return new Object without
     * any behavior, and object was inputed will be without any behavior
     */
	
	var objDebehaviorizer=function (obj,isSeparate) {
	  if(isSeparate){    
		  return deleteProperty(obj);
		  }
		else{
		  var objCopy=clone(obj);
		  deleteProperty(objCopy);
		  return objCopy;
		  }
  };

  /**
     * Object Behaviorizer.
     * This is function which will receive two objects as argument, and copy behavior from first object to second
     * object second Object will is changed.
     *
     * @private
     * @throws {Error} New error will thrown if destination object for behavior was frozen or sealed or non-object.
     * @param {Object} obj The object for copy his behavior to object 'obj1'.
     * @param {Object} obj1 The destination object for behavior received from object 'obj'.     
     */

  var objBehaviorizer=function (obj,obj1) {
  if(typeof obj1=='object' && !Object.isFrozen(obj1) && !Object.isSealed(obj1)){
  	var copy=clone(obj);
    var arrBehav=objDebehaviorizer(copy,true);
    for (var i = 0; i < arrBehav.length; i++) {    		
      obj1[arrBehav[i].name]=arrBehav[i];
    }
  } else{
    throw new Error('Can not add behave into obj');
    }
	};
// function to delete any behavior from 'currObj', return array with metods, and changing inputed obj
 function deleteProperty(currObj) {
  var behaveArr=[];  
  for(var prop in currObj){
    if(typeof currObj[prop]=='function'){
        behaveArr=behaveArr.concat(currObj[prop]);
        if(Object.getOwnPropertyDescriptor(currObj,prop)['configurable']) {
          delete currObj[prop];                 
        }
        else{
          throw new Error('The property '+ prop + ' is non-configurable');
        }
      }
      else if(typeof currObj[prop]=='object'){
        behaveArr=behaveArr.concat(deleteProperty(currObj[prop]));
      }
    }
  return behaveArr;
 }
 

function clone(cloneObj) {// function return copy of 'cloneObj'
  if (!(cloneObj instanceof Object)) {
    return cloneObj;
  } 
  var objectClone; 
  var Constructor = cloneObj.constructor;
  objectClone = new Constructor();
  for (var prop in cloneObj) {
    if (cloneObj.hasOwnProperty(prop)) {
      objectClone[prop] = clone(cloneObj[prop]);
    }
  }  
  return objectClone;
}
// function exchange symbols ',' and ';' in 'str' to other symbol for normal parsing future methods
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

function makeObj(str) {// function create new Object from sring, whithout array
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

function newFunction(str) {// function create new Function from string
  var isExistParameters=/\|function.*\((.*)\)/g;
  var bodyFunc;
  var param=['',''];
  var tmp;
  if((tmp=isExistParameters.exec(str))){
    param=tmp;
    bodyFunc=/{(.*)}/.exec(str);    
  }
  else{
    bodyFunc=/\|(.*)\|/.exec(str);
  }
  return new Function(param[1],bodyFunc[1]); // 'new Function' is a form of eval, but required here
}
/**
  * Object parseToObj.
  * This is function create new Object from string
  *
  * @private
  * @param {str} string to create Object
  * @returns {Object} new Object from inputed string 
*/
var parseToObj=function (str) {
    var index;
    var strToArray;
    var keyArr;
    var propArr=[];
    var arrOfObj=[];
    var output;    
    if(str.indexOf(':')<0){
      output=makeObj(str);
    }
    else {
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
};

/**
  * objStringyFy function
  * This is function which will receive object and callback-function and return new string with properties of this
  * is object. All properties in initial object will parse to string.
  * Callback-function will be used to remove any functions from initial object before parsing.
  *
  * @private
  * @param {Object} obj The object will parse to string without methods after calling callback function remover.
  * @param {Function} callback The function which will delete methods from initial object 'obj' before he will parse.
  * @returns {string} Returns new string with properties with delimiter semicolon.
  */
var objStringyFy=function (obj,callBack) {
  var result='{';
  var objNew;
  if(callBack!==undefined){
    objNew=callBack.call(this,obj);
  }
  else{
  	objNew=obj;
  }
  for(var prop in objNew){
    if(obj.hasOwnProperty(prop)){
      if(typeof objNew[prop]!='object'){
        result+=prop+ ',' + objNew[prop]+';';
      } else{
        result+=prop+','+objStringyFy(objNew[prop]);
      }
    }
  }
  result+='}';
  return result;
};
	

 /**
     * Functions are returned from this library.
     *
     * @public
     * @returns {Function}:
	   * memoizeArbitrary
		 * isLikeArray
		 * objDebehaviorizer
		 * objBehaviorizer
		 * parseToObj
		 * objStringyFy
 */
	return {
		memoizeArbitrary:memoizeArbitrary,
		isLikeArray:isLikeArray,
		objDebehaviorizer:objDebehaviorizer,
		objBehaviorizer:objBehaviorizer,
		parseToObj:parseToObj,
		objStringyFy:objStringyFy
	};

})();

module.exports=STKit;
