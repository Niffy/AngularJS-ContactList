'use strict';

var contactApp = angular.module('contactApp', ['ngRoute', 'contactControllers']);

contactApp.config(['$routeProvider',
	function($routeProvider){
	$routeProvider.
			when('/contacts',{
				templateUrl: 'contactList.html',
				controller: 'ContactListCtrl'
			}).
			when('/contacts/:name',{
				templateUrl: 'contact-detail.html',
				controller: 'ContactDetailCtrl'
			}).
			otherwise({
				redirectTo: '/contacts'
			});
	}
]);