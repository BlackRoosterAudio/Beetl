'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('RegistrationCtrl', ['$scope', '$state', 'apiHandler', function($scope, $state, apiHandler) {

	// Prequisites
	$scope.userCreated = false;

	/**
	 * Function will send the user object
	 * to the api (database save)
	 */
	$scope.createUser = function() {
		apiHandler.setUser($scope.user)
			.success(function() {
				$scope.userCreated = true;
				$state.go('login');
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 0, msg: err });
			});
	};
}]);