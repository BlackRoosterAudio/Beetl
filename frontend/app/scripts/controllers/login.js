'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('LoginCtrl', ['$scope', '$rootScope', '$http', 'apiHandler', '$state', function($scope, $rootScope, $http, apiHandler, $state) {
	
	/**
	 * The function will try to authenticate the user
	 * against the api, given the credentials on $scope
	 * and register the currentUser to $rootScope
	 */
	$scope.login = function() {
		var payload = {
			username : $scope.username,
			password : $scope.password
		};

		apiHandler.login(payload)
			.success(function(res) {
				// Grab user object and register to rootScope & headers
				$rootScope.currentUser                        = res;
				$rootScope.currentUser.password               = undefined;
				$http.defaults.headers.common['beetl-bearer'] = res.beetlBearer;

				// Register user to localstorage
				localStorage.setItem('currentUser', JSON.stringify($rootScope.currentUser));

				// Redirect to catalogue list
				$state.go('catalogueList');
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 5, msg: err });
			});
	};
}]);