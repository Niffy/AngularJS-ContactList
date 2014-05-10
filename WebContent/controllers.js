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
	    },
	    updateContact: function(id, name, email, location, number){
	    	console.log("going to update contact  id: ", id);
	    	var contact = this.getContact(id);
	    	console.log("was: " + contact.name + "now: " + name);
	    	contact.name = name;
	    	contact.email = email;
	    	contact.location = location;
	    	contact.primary = number;
	    },
	    destroyContact: function(id){
	    	console.log("going to destroy contact  id: ", id);
	    	for (var d = 0, len = contactList.length; d < len; d += 1) {
	    		console.log("current id:" + contactList[d].id);
	            if (contactList[d].id == id) {
	            	console.log("Found it del....!");
	                contactList.splice(d,1);
	                break;
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
	
	/**
	 * TODO can we not move the destroy function by both controllers into another controller? so create a /delete/ route?
	 */
	$scope.destroy = function(id){
    	Data.destroyContact(id);
    };
	
}]);

contactControllers.controller('ContactDetailCtrl', ['$scope', '$routeParams', '$location', 'Data',
	function($scope, $routeParams, $location, Data){
		$scope.contactID = $routeParams.contactID;
		var contact = Data.getContact($scope.contactID);
		console.log("Contact Found: " + contact);
		console.log(contact);
		$scope.contactName = contact.name;
		$scope.contactEmail = contact.email;
		$scope.contactLocation = contact.location;
		$scope.contactNumber = contact.primary;
		
		$scope.save = function() {
			Data.updateContact($scope.contactID,$scope.contactName,$scope.contactEmail,$scope.contactLocation,$scope.contactNumber);
			$location.path('/');
	    };
	    
	    $scope.destroy = function(){
	    	Data.destroyContact($scope.contactID);
	    	$location.path('/');
	    };
	}
]);