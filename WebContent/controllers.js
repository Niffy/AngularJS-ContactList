'use strict';
var contactControllers = angular.module('contactControllers', []);

contactControllers.factory('Data', function($http){
	var contactList = [];
	var nextNumber = 0;
	var alreadyCollected = false;
	
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
	    	alreadyCollected = true;
	    	contactList = data;
	    	this.findNextNumber();
	    },
	    isCollected: function(){
	    	return alreadyCollected;
	    },
	    findNextNumber:function(){
	    	var newNumber = 0;
	    	console.log("startingNumber = 0");
	    	for (var d = 0, len = contactList.length; d < len; d += 1) {
	    		if(contactList[d].id >= newNumber){
	    			newNumber = contactList[d].id;
	    			console.log("newNumber now: " + newNumber);
	    		}
	    	}
	    	newNumber++;
	    	console.log("newNumber set at: " + newNumber);
	    	nextNumber = newNumber;
	    },
	    getNextIDNumber: function(){
	    	return nextNumber++;
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
	    createContact: function(id, name, email, location, number){
	    	var contact = {
	    		id: id,
	    		name: name,
	    		email: email,
	    		location: location,
	    		primary: number
	    	};
	    	contactList.push(contact);
	    	
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
	if(Data.isCollected()){
		$scope.contacts = Data.getData();
	}else{
		Data.initData().success(function(data){
			Data.setData(data);
			$scope.contacts = data;	
		});
	}
	$scope.orderProp = 'id';
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

contactControllers.controller('ContactCreateCtrl', ['$scope', '$routeParams', '$location', 'Data',
	function($scope, $routeParams, $location, Data){
		$scope.save = function() {
			console.log("saving...");
			$scope.contactID = Data.getNextIDNumber();
			console.log("usign new id:" + $scope.contactID);
			Data.createContact($scope.contactID,$scope.contactName,$scope.contactEmail,$scope.contactLocation,$scope.contactNumber);
			$location.path('/');
	    };
	    
	    $scope.destroy = function(){
	    	$location.path('/');
	    };
	}
]);