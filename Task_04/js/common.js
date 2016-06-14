(function(){
	document.querySelector('.wrapper').style.width = window.innerWidth + 'px';
		getInfoFromService('getDocumentsList',createListDocs);


/*Save document to database*/
function save(data){
	var request = new XMLHttpRequest();
	request.open('POST','http://localhost:3000/docs.svc/saveDocument',true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=ISO-8859-1');
	request.send('document='+JSON.stringify(data));
}

/*Make AJAX request and call function callback with resived parametrs*/
function getInfoFromService(url,callback){
	var request = new XMLHttpRequest();
	var result;
	request.open('GET','http://localhost:3000/docs.svc/' + url,true);
		request.onreadystatechange = function(){
			if (request.readyState === 4){
				result = JSON.parse(request.responseText); 
				return callback(result);
			}
		};
	request.send();	

}

/*Create list of docs and create menu from this list*/
function createListDocs(docs){
	var docList = document.querySelector('.doc-list');
	var tmp;
	var docIndex = 0;
	for(tmp in docs){
		if(docs.hasOwnProperty(tmp)){
			var nodeLi = document.createElement('li');

			nodeLi.id = 'doc' + '_' + docIndex++;
			nodeLi.appendChild(docList.appendChild(document.createTextNode(docs[tmp].name)));
			var innerUl = document.createElement('ul');
			if(docs[tmp].fragments.length > 0){
				for (var i = 0; i <= docs[tmp].fragments.length - 1; i++) {
					if(!docs[tmp].fragments[i].name){
						continue;
					}
					var innerLi = document.createElement('li');
					var nodeLiLink = document.createElement('a');
					nodeLiLink.addEventListener('click',scrollWindow);
					nodeLiLink.href = '#' + 'p' + i;
					var innerText = document.createTextNode(docs[tmp].fragments[i].name);
					nodeLiLink.appendChild(innerText);
					innerLi.appendChild(nodeLiLink);
					innerUl.appendChild(innerLi);
				}
				nodeLi.appendChild(innerUl);
			}
			
			docList.appendChild(nodeLi);
			nodeLi.addEventListener('click', docEvent,true);
 			
		}
	}
}


/*Create open-window dialog for creating new document */
function createNewDocDialog(){
	var newdocDialog = createHTMLnode('div','newdoc-dialog');
	var newdocSaveForm = createHTMLnode('div','newdoc-save-form');
	var newdocForm = createHTMLnode('div','newdoc-form');
	var newdocNameInput = createHTMLnode('input','newDocName');
	var newDocLabel = createHTMLnode('span','','Document name');
	var btnContainer = createHTMLnode('div','btn-container'); 
	var newdocCreateButton = createHTMLnode('button','newDoc-create-btn','Create');
	var newdocCancelButton = createHTMLnode('button','newDoc-clear-btn','Cansel');
	appendChildHTMLNode(newdocForm,newDocLabel,newdocNameInput);
	appendChildHTMLNode(btnContainer,newdocCreateButton,newdocCancelButton);
	newdocForm.appendChild(btnContainer);
	newdocSaveForm.appendChild(newdocForm);
	newdocDialog.appendChild(newdocSaveForm);
	document.querySelector('body').insertBefore(newdocDialog,document.querySelector('.wrapper'));
}
/*Create open-window dialog for creating new pararaph */
function createNewParagraphDialog(){
	var newparDialog = createHTMLnode('div','newpar-dialog');
	var newparSaveForm = createHTMLnode('div','newpar-save-form');
	var newparForm = createHTMLnode('div','newpar-form');
	var btnContainer = createHTMLnode('div','btn-container'); 
	var containerDiv1 = document.createElement('div');
	var containerDiv2 = document.createElement('div');
	var newparNameInput = createHTMLnode('input','newParName');
	var newparContentInput = createHTMLnode('textarea','newParContent');
	var newParLabelName = createHTMLnode('span','','Paragraph name');
	var newparCreateButton = createHTMLnode('button','newPar-create-btn','Create');
	var newparCancelButton = createHTMLnode('button','newPar-clear-btn','Cansel');

	appendChildHTMLNode(containerDiv1,newParLabelName,newparNameInput);
	containerDiv2.appendChild(newparContentInput);
	appendChildHTMLNode(newparForm,containerDiv1,containerDiv2);
	appendChildHTMLNode(btnContainer,newparCreateButton,newparCancelButton);
	newparForm.appendChild(btnContainer);
	newparSaveForm.appendChild(newparForm);
	newparDialog.appendChild(newparSaveForm);
	document.querySelector('body').insertBefore(newparDialog,document.querySelector('.wrapper'));
}


function createHTMLnode(type,cssClass,textNode){  
  var newNode=document.createElement(type);
  if(cssClass){
   newNode.classList.add(cssClass);   
  }
  if(textNode){
   newNode.appendChild(document.createTextNode(textNode));
  }
  return newNode;
 }

 function appendChildHTMLNode(node) {
  for (var i = 1; i <arguments.length; i++) {
   node.appendChild(arguments[i]);
  }
 }



/*Create displaig documnt*/
function createDocument(paragraphs){

	document.querySelector('.main-content').innerHTML = '';
	var paragraphContainer = document.querySelector('.main-content');
	var paragraph = document.createElement('div');
	paragraph.classList.add('paragraph');
	for (var i = 0; i < paragraphs.fragments.length; i++ ) {
		if(!paragraphs.fragments[i].name || !paragraphs.fragments[i].content){
			continue;
		}
		var nodeH4 = document.createElement('h4');
		nodeH4.addEventListener('click', collapseParagraph);
		nodeH4.appendChild(document.createTextNode(paragraphs.fragments[i].name));
		nodeH4.id = 'p' + i;
		var nodeP = document.createElement('p');
		nodeP.appendChild(document.createTextNode(paragraphs.fragments[i].content));
		paragraph.appendChild(nodeH4);
		paragraph.appendChild(nodeP);
	}
	paragraphContainer.appendChild(paragraph);
}




/*Build new document for saving*/
var documentCreater = (function (){
	var documentForSave = {};

	return function(name,content){	
		if(!name && !content){
			var c = documentForSave;
			documentForSave = {};
			return c;
		}
		if(!documentForSave.hasOwnProperty('name')){
			document.querySelector('.save-btn').disabled = false;
			document.querySelector('.newpar-btn').disabled = false;
			documentForSave.name = name;
		}else {
			if(documentForSave.hasOwnProperty('fragments')){
				documentForSave.fragments.push({'name' : name , 'content' : content});
			}else {
				documentForSave.fragments = [];
				documentForSave.fragments.push({'name' : name , 'content' : content});
			}
		}			
	return documentForSave;
	};
}());

/*Keep start height of paragraphs*/
var saveHeight=(function () {
	var heightsObj={}	;
	return function (argument) {
		if(!heightsObj.hasOwnProperty(argument.id)){
			heightsObj[argument.id]=argument.nextElementSibling.clientHeight;
		}
		return heightsObj[argument.id];
	};
	
}());

/*Change height of block pararaph*/
function changeHeight(element,direction,height) {
	var currentHeight=element.clientHeight;
	var p=setInterval(function(){
		currentHeight+=direction*10;
		element.style.height=currentHeight+'px';
		if(currentHeight<=10 && direction==-1){
			element.style.height=0;
			clearInterval(p);			
		}		
		if(currentHeight>(height-10)){
			element.style.height=height;
			clearInterval(p);
		}
	},20);

}


/*Events*/

document.querySelector('.newdoc-btn').addEventListener('click', newDocOpenBtnEvent);
document.querySelector('.newpar-btn').addEventListener('click', newParOpenBtnEvent);
document.querySelector('.save-btn').addEventListener('click', saveEvent);


function docEvent(event){
	 var url = 'getDocumentById?docId=' + this.id.split('_')[1];	 
	 getInfoFromService(url,createDocument); 
	 

	 if(this.children[0].className.indexOf('visible')>=0){
	 	if(event.target.tagName !== 'A'){
	 		this.children[0].classList.remove('visible');
	 	}
	 }else{
	 	this.children[0].classList.add('visible');
	 }	
}


function newDocOpenBtnEvent(){
	createNewDocDialog();
	document.querySelector('body').classList.add('overflow-hidden');
	document.querySelector('.newDoc-create-btn').addEventListener('click', newDocCreateBtnEvent);
	document.querySelector('.newDoc-clear-btn').addEventListener('click', newDocCancelBtnEvent);
	document.querySelector('.newdoc-btn').disabled = true;	
}

function newParOpenBtnEvent(){
	createNewParagraphDialog();
	document.querySelector('body').classList.add('overflow-hidden');
	document.querySelector('.newPar-create-btn').addEventListener('click', newParCreateBtnEvent);
	document.querySelector('.newPar-clear-btn').addEventListener('click', newParCancelBtnEvent);	
}

	
function newDocCreateBtnEvent(){
	var newDocName =document.querySelector('.newDocName').value;
	documentCreater(newDocName);
	document.querySelector('body').classList.remove('overflow-hidden');	
	document.querySelector('body').removeChild(document.querySelector('.newdoc-dialog'));
	var cretingDocName = document.querySelector('.creating_doc_name');
	cretingDocName.appendChild(document.createTextNode(newDocName));
}

function newDocCancelBtnEvent(){
	document.querySelector('body').classList.remove('overflow-hidden');	
	document.querySelector('body').removeChild(document.querySelector('.newdoc-dialog'));
	document.querySelector('.newdoc-btn').disabled = false;
}

function newParCreateBtnEvent(){
	var name = document.querySelector('.newParName').value;
	var content = document.querySelector('.newParContent').value;
	documentCreater(name,content);
	document.querySelector('body').classList.remove('overflow-hidden');	
	document.querySelector('body').removeChild(document.querySelector('.newpar-dialog'));
	var cretingParContainer = document.querySelector('.list_new_par');
	var cretaingListPar = document.createElement('li');
	cretaingListPar.appendChild(document.createTextNode(name));
	cretingParContainer.appendChild(cretaingListPar);
}

function newParCancelBtnEvent(){
	document.querySelector('body').classList.remove('overflow-hidden');	
	document.querySelector('body').removeChild(document.querySelector('.newpar-dialog'));
}




function collapseParagraph(){	

	var element = this.nextElementSibling;
	var height = element.clientHeight; 
	
	if(height===0){
		changeHeight(element,1,saveHeight(this));
	}
	if(height===saveHeight(this)){
		changeHeight(element,-1,saveHeight(this));
	}	
}

function saveEvent(){
	save(documentCreater());
	document.querySelector('.newdoc-btn').disabled = false;
	document.querySelector('.newpar-btn').disabled = true;
	getInfoFromService('getDocumentsList',createListDocs);
	document.querySelector('.save-btn').disabled = true;
	document.querySelector('.creating_doc_name').innerHTML = '';
	document.querySelector('.list_new_par').innerHTML = '';

}


function scrollWindow(event) {
	
	var elementClick = event.target;
	var id = elementClick.hash;
	event.preventDefault();
	var target=document.querySelector(id).getBoundingClientRect().top;
	var k = window.pageYOffset;
	var i;
	var c=0;
	if(target > 50){
		i = 1;
	}else if(target<0) {
		i = -1;
	}else{		
		return;
	}

	var p = setInterval(function(){
		console.log(c++);
		target = document.querySelector(id).getBoundingClientRect().top;
		if(target<100 && target >= 0){
			clearInterval(p);
		}
		window.scrollTo(0,k);
		k+=(40 * i);
	},80);
}

})();
