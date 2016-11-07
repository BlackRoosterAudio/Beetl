'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:UserDetailCtrl
 * @description
 * # UserDetailCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('UserDetailCtrl', ['$scope', '$state', '$stateParams', 'apiHandler', function($scope, $state, $stateParams, apiHandler) {
	
	// Prequisites
	var userId       = $stateParams.id;
	$scope.user      = {};

	/**
	 * Function will call the API for user by ID
	 */
	apiHandler.getUser(userId)
		.success(function(res) {
			res.password = '';

			$scope.user = res;
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	/**
	 * Function will send the current user object
	 * to the API
	 * @param  {boolean} redirect [return to userList]
	 */
	$scope.saveUser = function(redirect) {

		if($scope.user.password == '') {
			delete $scope.user.password;
		}

		apiHandler.updateUser($scope.user).success(function() {
			if(redirect) {
				$state.go('userList');
			}
		});
	};
}]);