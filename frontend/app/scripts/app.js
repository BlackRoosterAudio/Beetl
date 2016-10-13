'use strict';

/**
 * @ngdoc overview
 * @name beetlApp
 * @description
 * # beetlApp
 *
 * Main module of the application.
 */
var app = angular.module('beetlApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'xeditable',
    'chart.js',
    'mgcrea.ngStrap'
]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// Default
	$urlRouterProvider.otherwise("/");

	// States
	$stateProvider
	.state('login', {
		url 		: "/",
		templateUrl : "views/login.html",
		controller  : "LoginCtrl"
	})
	.state('registration', {
		url 		: "/registration",
		templateUrl : "views/registration.html",
		controller  : "RegistrationCtrl"
	})
	.state('settings', {
		url 		: "/settings",
		templateUrl : "views/settings.html",
		controller  : "SettingsCtrl"
	})
	.state('profile', {
		url 		: "/profile",
		templateUrl : "views/profile.html",
		controller  : "ProfileCtrl"
	})
	.state('catalogueList', {
		url 		: "/catalogue",
		templateUrl : "views/catalogue.list.html",
		controller  : "CatalogueListCtrl"
	})
	.state('catalogueDetail', {
		url 		: "/catalogue/:id",
		templateUrl : "views/catalogue.detail.html",
		controller  : "CatalogueDetailCtrl"
	})
	.state('userList', {
		url 		: "/user",
		templateUrl : "views/user.list.html",
		controller  : "UserListCtrl"
	})
	.state('userDetail', {
		url 		: "/user/:id",
		templateUrl : "views/user.detail.html",
		controller  : "UserDetailCtrl"
	})
	.state('resultList', {
		url 		: "/result",
		templateUrl : "views/result.list.html",
		controller  : "ResultListCtrl"
	})
	.state('resultOverview', {
		url 		: "/result/overview/:id",
		templateUrl : "views/result.overview.html",
		controller  : "ResultOverviewCtrl"
	})
	.state('resultDetail', {
		url 		: "/result/:id",
		templateUrl : "views/result.detail.html",
		controller  : "ResultDetailCtrl"
	})
	.state('projectList', {
		url 		: "/project",
		templateUrl : "views/project.list.html",
		controller  : "ProjectListCtrl"
	})
	.state('projectDetail', {
		url 		: "/project/:id",
		templateUrl : "views/project.detail.html",
		controller  : "ProjectDetailCtrl"
	})
	.state('errorPage', {
		url 		: "/error/:errorId",
		templateUrl : "views/error.html",
		controller  : "ErrorCtrl"
	});
}]);

app.run(['$rootScope', '$state', 'editableOptions', 'editableThemes', function($rootScope, $state, editableOptions, editableThemes) {
	
	// Editable Themes
	editableThemes.bs3.inputClass   = 'input-sm';
	editableThemes.bs3.buttonsClass = 'btn-sm';
	editableOptions.theme           = 'bs3';

	// Globals
	$rootScope.currentUser = {};
	$rootScope.helper      = {};
	$rootScope.$state      = $state;

	// Grab currentUser from local storage
	try {
		$rootScope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}
	catch(e) {}

	// Redirect to login
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState) {
	    if((!$rootScope.currentUser || !$rootScope.currentUser.id) && toState.name !== 'login' && toState.name !== 'registration') {
			$state.go('login');

			event.preventDefault();
	    }
	    $rootScope.$state = $state;
	});

	// Helper Functions
	$rootScope.helper.dateFormat = function(dateTime) {	
		var _tmpDate = new Date(dateTime);
		return ("0" + _tmpDate.getDate()).slice(-2) + "-" + 
		       ("0"+(_tmpDate.getMonth()+1)).slice(-2) + "-" +
                _tmpDate.getFullYear() + " / " + 
               ("0" + _tmpDate.getHours()).slice(-2) + ":" + 
               ("0" + _tmpDate.getMinutes()).slice(-2) + 'h';
	};	
}]);