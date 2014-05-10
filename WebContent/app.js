'use strict';

var contactApp = angular.module('contactApp', ['ngRoute', 'contactControllers']);

contactApp.config(['$routeProvider',
	function($routeProvider){
	$routeProvider.
			when('/contacts',{
				templateUrl: 'contactList.html',
				controller: 'ContactListCtrl'
			}).
			when('/contacts/:contactName',{
				templateUrl: 'contactDetail.html',
				controller: 'ContactDetailCtrl'
			}).
			otherwise({
				redirectTo: '/contacts'
			});
	}
]);