var str1 = '123x1z13', str2 = 'a123';
var data = ";key,value;key1,value;key3,value3;";
var data1 = ";key,value;key1,value;arrayHere:k1,v1;k2,v2;k3,v3";
 
findSum(str1,str2);
parseToObj(data);
parseToObj(data1);
/*Find sum number in string*/

function findSum(str) {
  let regExp=/[^0-9A-Fa-f]+/g;
  let regExpHex=/[a-fA-F]+/g;
  let result=0;
  for (let i = 0; i < arguments.length; i++) {
    let inputStr=arguments[i].replace(regExp,"");
    if(inputStr.search(regExpHex)>-1)
    {
      result+=parseInt(inputStr,16);
    }
    else
    {
      result+=parseInt(inputStr,10);
    }
  }

  
  console.log("Sum all string is "+result);
}

/* Parse any string to object*/
  function makeObj(str) {
    let inputSplit=str.split(";");
    let output=new Object();
    for (let i = 0; i < inputSplit.length; i++) {
      let partSplit=inputSplit[i].split(",");
      if(partSplit[0]!="")
        {
          output[partSplit[0]]=partSplit[1];
        }
    }
    return output;
  }

  function parseToObj(str) {
    let output;
    let index;
    let strToArray;
    let keyArr;
    let propArr=[];
    let arrOfObj=[];
    if(str.indexOf(":")<0){
      output=makeObj(str);
    }
    else
    {
      index=str.substring(0,str.indexOf(":")).lastIndexOf(";");
      output=makeObj(str.substring(0,index));
      strToArray=str.substring(index+1,str.length).split(":");
      keyArr=strToArray[0];
      arrOfObj=strToArray[1].split(";");
      for (let i = 0; i < arrOfObj.length; i++) {
        let key=arrOfObj[i].substring(0,arrOfObj[i].indexOf(","));
        let value=arrOfObj[i].substring(arrOfObj[i].indexOf(",")+1,arrOfObj[i].length);
        propArr[i]=new Object();
        propArr[i][key]=value;
      }
      output[keyArr]=propArr;
    }
    console.log(output);
  }