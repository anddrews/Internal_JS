'use strict';

var documentApp=angular.module('documentApp',[]);

documentApp.controller('documentListCtrl',function ($scope,$http) {
	
	$http.get('http://localhost:3000/docs.svc/getDocumentsList').success(function(data){
		$scope.documents=data;
	});

	$scope.showList=function(docName){
		for(var tmp in $scope.documents){
			if($scope.documents.hasOwnProperty(tmp)){
				document.querySelector('.fragments-'+tmp).classList.remove('visible');							
			}
		}
		document.querySelector('.fragments-'+docName).classList.toggle('visible');
		$http.get('http://localhost:3000/docs.svc/getDocumentById?docId='+docName)
			.success(function(data){
				$scope.fullDocument=data.fragments;
			});
	};

	$scope.setFragmentPosition=function(fragmentId){
		var target=document.querySelector('.fragmentId'+fragmentId).getBoundingClientRect().top;	
		var i;
		if(target > 50){
			i = 2;
		}else if(target<0) {
			i = -2;
		}else{		
			return;
		}

		var p = setInterval(function(){
			target = document.querySelector('.fragmentId'+fragmentId).getBoundingClientRect().top;
			if(target<15 && target >= 10){
				clearInterval(p);
			}
			window.scrollBy(0,i);
		},0.8);
		};
});
