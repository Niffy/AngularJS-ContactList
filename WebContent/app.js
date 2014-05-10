'use strict';

var contactApp = angular.module('contactApp', ['ngRoute', 'contactControllers']);

contactApp.config(['$routeProvider',
	function($routeProvider){
	$routeProvider.
			when('/contacts',{
				templateUrl: 'contactList.html',
				controller: 'ContactListCtrl'
			}).
			when('/contacts/:contactID',{
				templateUrl: 'contactDetail.html',
				controller: 'ContactDetailCtrl'
			}).
			when('/create',{
				templateUrl: 'contactDetail.html',
				controller: 'ContactCreateCtrl'
			}).
			otherwise({
				redirectTo: '/contacts'
			});
	}
]);