let testArr=[[9,2,3],[1,5,6],[7,8,4]];
let sortArray=[2,4,3,6,8,9,1,7];
let obj1 = { a: 2, c: 3, d: 3};
let obj2 = { a: 1 };
let obj3 = { a: 2, c: 3};
let arOfObj = [obj1, obj2, obj3];

minInArray(testArr);
maxInArray(testArr);
avgInArray(testArr);
bubbleSort(sortArray);
insertSort(sortArray);
shellSort(sortArray);
countingSort(sortArray);
console.log(quickSort(sortArray));
someTriangle(9);
onceTriangle(9);
objSort(arOfObj,"asc");

/* Sort array by property count*/
function objSort(arrObj,way) {
	let index;
	let lastIndex=arrObj.length-1;
	console.log("input array "+JSON.stringify(arrObj));
	if(way=="disc")
	{
		index=-1;
	}
	else if (way=="asc") 
	{
		index=1;
	}
	for (let i = 0; i <lastIndex ; i++) {
		for (let j = 0; j < lastIndex-i; j++) {
			if(Object.keys(arrObj[j]).length*index>Object.keys(arrObj[j+1]).length*index){				
				arrObj.splice(j,2,arrObj[j+1],arrObj[j]);
			}
		}		
	}
	console.log("output array "+JSON.stringify(arrObj));
}

/* Sort array any methods*/

function bubbleSort(arr) {
	let lastIndex=arr.length-1;
	for (let i = 0; i <lastIndex ; i++) {
		for (let j = 0; j < lastIndex-i; j++) {
			if(arr[j]>arr[j+1]){				
				arr.splice(j,2,arr[j+1],arr[j]);
			}
		}		
	}
	console.log(arr);
}

function insertSort(arr) {
	let lastIndex=arr.length;
	for (let i = 1; i <lastIndex ; i++) {
		j=i;
		while(arr[j]<arr[j-1] && j>=1) {
				arr.splice(j-1,2,arr[j],arr[j-1]);
				j--;
			}
	}	
	console.log(arr);
}

function quickSort(arr) {
	if (arr.length === 0) return [];
	  let a = [], b = [], p = arr[0];
	  for (let i = 1; i < arr.length; i++) {
	    if (arr[ i ] < p) {
	      a[a.length] = arr[ i ]; 
	    } else {
	        b[b.length] = arr[ i ];
	      }
	  }
	  return quickSort(a).concat(p, quickSort(b));
}

function shellSort(arr) {
	let gap, i, j, temp;
	let len=arr.length;
	if(len%2!=0)
	{
		gap=Math.floor(len/2)+1;
	}
	else
	{
		gap=Math.floor(len/2);
	}
	for (gap; gap > 0; gap /= 2)
	{
	    for (i = gap; i < len; i++)
	    {
	        for (j = i - gap; j >= 0 && arr[j] > arr[j + gap]; j -= gap) 
	        {
	            let temp = arr[j];
	            arr[j] = arr[j + gap];
	            arr[j + gap] = temp;
	        }
	    }
	}
	console.log(arr);
}

function countingSort(arr) {
	let n = arr.length, Count = [], B = [];
	for (i = 0; i < n; i++) Count[ i ] = 0;
	for (i = 0; i < n-1; i++)
		    {
		     for (let j = i+1; j < n; j++)
		        {
		         	if (arr[i] < arr[j])
		         	{
		         	  Count[j]++;
		         	}
		         	else
		         	{
		         	 Count[ i ]++;
		         	}
		        }
		    }
	for (i = 0; i < n; i++) B[Count[ i ]] = arr[ i ];
	arr=B;    
	console.log(arr);
}

/*Triangles from 0 and 1*/
function someTriangle(sideSize) {
	let resultStr;
	let resultArr=[];
	for(let i=0;i<sideSize;i++){
		resultArr[i]=[];
	}
	if(sideSize%2==0){
		resultStr="wrong argument"
	}
	else{
		console.log("some triangles");
		for(let i=0;i<sideSize;i++){
			let line="";
			for(let j=0;j<sideSize;j++){
				let index;
				if(i<sideSize/2)
				{
					index=1;
				}
				else
				{
					index=-1;
				}
				if(index*j<index*i || index*j>index*(sideSize-i-1))
				{
					resultArr[i][j]=0;
				}				
				else
				{
					resultArr[i][j]=1;
				}
			}
		}
		for(let i=0;i<sideSize;i++){
			console.log(resultArr[i]);
		}

	}
}

function onceTriangle(sideSize) {
	let resultStr;
	let resultArr=[];
	for(let i=0;i<sideSize;i++){
		resultArr[i]=[];
	}
	if(sideSize%2==0){
		resultStr="wrong argument"
	}
	else{
		console.log("once triangle");
		for(let i=0;i<sideSize;i++){
			let line="";
			for(let j=0;j<sideSize;j++){				
				if(j<i || j>(sideSize-i-1))
				{
					resultArr[j][i]=0;
				}				
				else
				{
					resultArr[j][i]=1;
				}
			}
		}
		for(let i=0;i<sideSize;i++){
			console.log(resultArr[i]);
		}

	}
}

/*find min max and avg in square array*/
function minInArray(arr) {
	let size=arr[0].length-1;
	let min=arr[0][0];
	for (let i = size; i >= 0; i--){
		for (let j = size; j>=0; j--) {
			if (arr[i][j]<min) {
				min=arr[i][j];
			}
		}
	}
	console.log("min element in array " + min);
} 

function maxInArray(arr) {
	let size=arr[0].length-1;
	let max=arr[0][0];
	for (let i = size; i >= 0; i--){
		for (let j = size; j>=0; j--) {
			if (arr[i][j]>max) {
				max=arr[i][j];
			}
		}
	}
	console.log("max element in array " + max);
} 

function avgInArray(arr) {
	let size=arr[0].length;
	let sum=0;
	let avg;
	for (let i = size-1; i >= 0; i--){
		for (let j = size-1; j>=0; j--) {
			sum+=arr[i][j];
		}
	}
	avg= sum/(size*size);
	console.log("avg element in array " +avg);
} 