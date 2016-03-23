'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ProfileCtrl', ['$scope', '$state', '$rootScope', 'apiHandler', function($scope, $state, $rootScope, apiHandler) {
	
	// Prequisites
	var userId       = $rootScope.currentUser.id || undefined;
	$scope.user      = {};

	// Get out if user could not be found
	if(userId === undefined) {
		$state.go('errorPage', { errorId: 6 });
		return;
	}

	/**
	 * Function will call the API for user by ID
	 */
	apiHandler.getUser(userId)
		.success(function(res) {
			$scope.profile = res;
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2 });
		});

	/**
	 * Function will send the current user object
	 * to the API
	 * @param  {boolean} redirect [return to userList]
	 */
	$scope.saveProfile = function() {
		apiHandler.updateUser($scope.profile);
	};
}]);