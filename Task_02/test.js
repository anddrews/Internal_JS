var STKit = require('./stkkit');
var testStr = ';methodName1,|return true;|;methodName,|function (a,r,f,t) { return a + 1; }|;'+
'key,value;key1,value;arrayHere:k1,v1;k2,v2;k3,v3;key3,value3';
var objWithoutMethod={a:3};

function factorial(n) {
    var res = 1;
    while(n !== 1) {
        res *= n--;
    }
    return res;
}

function someParameters(param1,param2) {
	return param1+param2;
}

// testing memoization
var memoOnce=STKit.memoizeArbitrary(factorial);
var memoArbitr=STKit.memoizeArbitrary(someParameters);
console.log(memoOnce(5));
console.log(memoOnce(5));
console.log(memoArbitr(5,5));
console.log(memoArbitr(5,5));

// testing create Object

var testObj=STKit.parseToObj(testStr);
console.log('Object from string');
console.log(testObj);

// testing is like array

console.log('is like Array:' +STKit.isLikeArray(testObj.arrayHere));

// testing debehaviorizer

var objDebehav=STKit.objDebehaviorizer(testObj);
console.log('Object whithout behavior');
console.log(objDebehav);

//testing behaviorizer

STKit.objBehaviorizer(testObj,objWithoutMethod);
console.log(objWithoutMethod);
