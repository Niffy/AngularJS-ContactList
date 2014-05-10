'use strict';
var contactControllers = angular.module('contactControllers', []);

/**
 * TODO can we initData the data on construction of factory rather then controller starting the action
 * This isn't a pretty and may fail when we clear all the data on purpose
 */
contactControllers.factory('Data', function($http){
	var contactList = [];
	/*
	$http.get('contacts.json.fix').success(function(data){
		contactList.content = data;
		console.log("getting json?");
	});
*/
	return{
	    initData : function() {
	    	console.log("initData");	
	        return $http({
	            url: 'contacts.json.fix',
	            method: 'GET'
	        });
	    },
	    setData: function(data){
	    	console.log("setData");
	    	contactList = data;
	    },
	    getData: function(){
	    	console.log("getData");
	    	return contactList;
	    }
	 };
	//return contactList;
});


contactControllers.controller('ContactListCtrl', ['$scope', 'Data',
	function($scope, Data){
	$scope.contacts = [];
	var listLength = Data.getData().length;
	console.log("DataLegnth: " + listLength);
	if(listLength != 0){
		console.log("data not 0");
		$scope.contacts = Data.getData();
	}else{
		Data.initData().success(function(data){
			Data.setData(data);
			$scope.contacts = data;
			console.log($scope.contacts);	
		});
		$scope.orderProp = 'name';
	}
	
	/*
		$http.get('contacts.json.fix').success(function(data){
			$scope.contacts = data;
		});
		
		$scope.orderPop = 'name';
		*/
}]);

contactControllers.controller('ContactDetailCtrl', ['$scope', '$routeParams',
	function($scope, $routeParams){
		$scope.contactName = $routeParams.contactName;
	}
]);