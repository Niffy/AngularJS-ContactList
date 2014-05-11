'use strict';
/*
 * Create a new module called contactControllers which will contain the controllers
 */
var contactControllers = angular.module('contactControllers', []);

/*
 * A factory which will store the data for use by both controllers.
 * We require this, in my view, as its a simple way of sharing data without
 * doing things like broadcasting or storing in the root scope.
 * It contains the contactList, the next ID number to use and if the data
 * has been collected.
 * 
 * I need to look at collecting the data in the factory without any prompting
 * from a controller to go and collect it.
 * Although a service might be what is really required here.
 * I need to look at the difference between factory, service and provider.
 */
contactControllers.factory('Data', function($http){
	var contactList = [];
	var nextNumber = 0;
	var alreadyCollected = false;
	
	return{
		/*
		 * Go and get the content of the json file
		 * and return a promise to work with.
		 */
	    initData : function() {	
	        return $http({
	            url: 'contacts.json.fix',
	            method: 'GET'
	        });
	    },
	    /*
	     * Set the data so it can be shared.
	     * Flag it has been collected so we don't reload
	     * the data and loose its states.
	     * Also go and find the next ID number to use
	     */
	    setData: function(data){
	    	alreadyCollected = true;
	    	contactList = data;
	    	this.findNextNumber();
	    },
	    /*
	     * Has the data already been collected?
	     */
	    isCollected: function(){
	    	return alreadyCollected;
	    },
	    /*
	     * Search through all the IDs of the contact and find the highest ID
	     * then increment for use later on creation of another contact.
	     * Ideally the ID would be a random value (perhaps a uuid?) so searching
	     * wouldn't be required.
	     */
	    findNextNumber:function(){
	    	var newNumber = 0;
	    	for (var d = 0, len = contactList.length; d < len; d += 1) {
	    		if(contactList[d].id >= newNumber){
	    			newNumber = contactList[d].id;
	    		}
	    	}
	    	newNumber++;
	    	nextNumber = newNumber;
	    },
	    /*
	     * Get the next ID number that can be used.
	     */
	    getNextIDNumber: function(){
	    	return nextNumber++;
	    },
	    /*
	     * return the contact list
	     */
	    getData: function(){
	    	return contactList;
	    },
	    /*
	     * Get a specific contact details based on their ID.
	     * A library or some sort of collection might be better than 
	     * manually searching an array.
	     * 
	     */
	    getContact: function(id){
	    	for (var d = 0, len = contactList.length; d < len; d += 1) {
	            if (contactList[d].id == id) {
	                return contactList[d];
	            }
	        }
	    },
	    /*
	     * Create a new contact with the given arguments and add
	     * to the contact list array.
	     * 
	     * In retrospect this might be the best time to allocate the ID
	     * and then return the ID used.
	     */
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
	    /*
	     * Update a given contact with the given arguments.
	     * 
	     * No check is done if the contact really exists, blind faith here.
	     */
	    updateContact: function(id, name, email, location, number){
	    	var contact = this.getContact(id);
	    	contact.name = name;
	    	contact.email = email;
	    	contact.location = location;
	    	contact.primary = number;
	    },
	    /*
	     * Delete a contact with a given ID.
	     * 
	     * Again, searching the array manually, a collection or library could
	     * do this for me.
	     */
	    destroyContact: function(id){
	    	for (var d = 0, len = contactList.length; d < len; d += 1) {
	            if (contactList[d].id == id) {
	                contactList.splice(d,1);
	                break;
	            }
	        }
	    }
	 };
});

/*
 * Create a controller for the contact list. It requires the global scope
 * and the Data factory to be injected.
 */
contactControllers.controller('ContactListCtrl', ['$scope', 'Data',
	function($scope, Data){
	$scope.contacts = [];
	/*
	 * Since we flip between views, we need to retain the contact list state.
	 * To do this we use a factory.  So we only need to initiate loading the
	 * JSON file once, otherwise every time the controller is created we keep
	 * loading the data again and lose the state. So....
	 * Check if we have already collected the data,
	 * If not then go and ask for it to be collected,
	 * then on the success of collection set the data in the factory and store
	 * this data in the scope.
	 */
	if(Data.isCollected()){
		$scope.contacts = Data.getData();
	}else{
		Data.initData().success(function(data){
			Data.setData(data);
			$scope.contacts = data;	
		});
	}
	/*
	 * Default ordering of list. Can't we get the template to set the default?
	 */
	$scope.orderProp = 'id';
	/*
	 * When the delete button is pressed on the list, this is called. Which
	 * calls the relevant factory method to do the deed.
	 */
	$scope.destroy = function(id){
    	Data.destroyContact(id);
    };
	
}]);

/*
 * Create a controller for the detail view. Requires the following injections
 * global scope, routeParams service to read the url,
 * the location service to set the url and the Data factory.
 * 
 * This has no logic of dealing with an invalid contact ID, dangerous! 
 */
contactControllers.controller('ContactDetailCtrl', ['$scope', '$routeParams', '$location', 'Data',
	function($scope, $routeParams, $location, Data){
		/*
		 * We want to show the delete button
		 */
		$scope.deleteShow = true;
		/*
		 * Get the contactID out of the url to go and retrieve the contact,
		 * store the values in the global scope for the template to use
		 */
		$scope.contactID = $routeParams.contactID;
		var contact = Data.getContact($scope.contactID);
		$scope.contactName = contact.name;
		$scope.contactEmail = contact.email;
		$scope.contactLocation = contact.location;
		$scope.contactNumber = contact.primary;
		
		/*
		 * Update the contact with the values from the template. Then go back to the list view.
		 */
		$scope.save = function() {
			Data.updateContact($scope.contactID,$scope.contactName,$scope.contactEmail,$scope.contactLocation,$scope.contactNumber);
			$location.path('/');
	    };
	    /*
	     * Delete the current contact then go back to the list view.
	     */
	    $scope.destroy = function(){
	    	Data.destroyContact($scope.contactID);
	    	$location.path('/');
	    };
	}
]);

/*
 * Create a controller to handle creating a new contact.
 * It requires the following injections,
 * global scope, routeParams service to read the url,
 * the location service to set the url and the Data factory.
 */
contactControllers.controller('ContactCreateCtrl', ['$scope', '$routeParams', '$location', 'Data',
	function($scope, $routeParams, $location, Data){
		/*
		 * Get a new ID, call the create method in the factory and go back to the list.
		 */
		$scope.save = function() {
			$scope.contactID = Data.getNextIDNumber();
			Data.createContact($scope.contactID,$scope.contactName,$scope.contactEmail,$scope.contactLocation,$scope.contactNumber);
			$location.path('/');
	    };
	    /*
	     * Go back to the list view 
	     */
	    $scope.destroy = function(){
	    	$location.path('/');
	    };
	}
]);