'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:UserListCtrl
 * @description
 * # UserListCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('UserListCtrl', ['$scope', '$state', '$stateParams', 'apiHandler', function($scope, $state, $stateParams, apiHandler) {
	
	// Prequisites
	$scope.users = {};

	/**
	 * The function will initialize the user list
	 */
	var initializeUserList = function() {
		$scope.users = [];
		apiHandler.getUserList()
			.success(function(res) {
				$scope.users = res;
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 1, msg: err });
			});
	};

	// Initialize on controller loading
	initializeUserList();

	/**
	 * The function will delete the given user
	 */
	$scope.deleteUser = function(id) {
		apiHandler.deleteUser(id)
			.success(function() {
				initializeUserList();
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 4, msg: err });
			});
	};

	/**
	 * The function will create a new user object
	 */
	$scope.createUser = function() {
		apiHandler.setUser()
			.success(function(res) {
				$state.go('userDetail', { id: res.id });
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 3, msg: err });
			});
	};
}]);