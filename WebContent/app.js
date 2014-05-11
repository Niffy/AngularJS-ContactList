'use strict';
/*
 * Creating the an app module called contactApp, 
 * it has dependencies of ngRoute for the route provider and contactControllers
 * which controls specific parts of the app.
 */
var contactApp = angular.module('contactApp', ['ngRoute', 'contactControllers']);

/*
 * Config the app, we require the routeProvider so inject it!
 * This basically looks at the url and depending on the path it loads
 * the template and controller to construct the related view.
 */
contactApp.config(['$routeProvider',
	function($routeProvider){
	$routeProvider.
			when('/contacts',{
				templateUrl: 'contactList.html',
				controller: 'ContactListCtrl'
			}).
			/*
			 * When the contact ID is in the url change the view (template and controller)
			 */
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