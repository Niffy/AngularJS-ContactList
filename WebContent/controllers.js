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
	    },
	    getContact: function(id){
	    	console.log("Searching for ID: " + id);
	    	for (var d = 0, len = contactList.length; d < len; d += 1) {
	    		console.log("current id:" + contactList[d].id);
	            if (contactList[d].id == id) {
	            	console.log("Found it!");
	                return contactList[d];
	            }
	        }
	    }
	 };
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
}]);

contactControllers.controller('ContactDetailCtrl', ['$scope', '$routeParams', 'Data',
	function($scope, $routeParams, Data){
		$scope.contactID = $routeParams.contactID;
		var contact = Data.getContact($scope.contactID);
		console.log("Contact Found: " + contact);
		console.log(contact);
		$scope.contactName = contact.name;
		$scope.contactEmail = contact.email;
		$scope.contactLocation = contact.location;
		$scope.contactNumber = contact.primary;
	}
]);