reverseString("12345");
isEndWith("12345678","8");
isEndWith("12345678","9");
isStartWith("12345","1");
isStartWith("12345","3");
isPascalCase("kjkj_ljl_kjh");
isPascalCase("kjkjljlDkjh");
isCamelCase("kSdd");
isCamelCase("kSdd_");

function reverseString(str) {
	var d=str.split("");
	d.reverse();
	var result=d.join("");
	console.log("inputed string "+str+" result string "+result);
}

function isEndWith(str, find) {
	var result=(find==str.slice(str.length-find.length));
	console.log("is string "+str+ " end with "+ find +" - "+ result);
	return result;
}

function isStartWith(str, find) {
	var result=(find==str.slice(0,find.length));
	console.log("is string "+str+ " start with "+ find +" - "+ result);
	return result;
}

function isPascalCase(str) {
	var spl=/^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)+$/g;
	console.log(str+ " is pascale case "+spl.test(str));
}
function isCamelCase(str) {
	var spl=/^[a-z][a-z0-9]*([A-Z][a-z0-9]+)+$/g;
	console.log(str+ " is camel case "+spl.test(str));
}