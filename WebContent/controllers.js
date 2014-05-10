'use strict';
var contactControllers = angular.module('contactControllers', []);

contactControllers.controller('ContactListCtrl', ['$scope', '$http',
	function($scope, $http){
		$http.get('contacts.json.fix').success(function(data){
			$scope.contacts = data;
		});
		
		$scope.orderPop = 'name';

}]);

contactControllers.controller('ContactDetailCtrl', ['$scope', '$routeParams',
	function($scope, $routeParams){
		$scope.contactName = $route.contactName;
	}
]);