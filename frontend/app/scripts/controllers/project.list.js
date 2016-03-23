'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ProjectListCtrl', ['$scope', '$state', '$stateParams', 'apiHandler', function($scope, $state, $stateParams, apiHandler) {

	// Prequisites
	$scope.projects = {};

	/**
	 * The function will initialize the project list
	 */
	var initializeProjectList = function() {
		$scope.projects = [];
		apiHandler.getProjectList()
			.success(function(res) {
				$scope.projects = res;
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 1, msg: err });
			});
	};

	// Initialize on controller loading
	initializeProjectList();

	/**
	 * The function will delete the given project
	 */
	$scope.deleteProject = function(id) {
		apiHandler.deleteProject(id)
			.success(function() {
				initializeProjectList();
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 4, msg: err });
			});
	};

	/**
	 * The function will create a new project object
	 */
	$scope.createProject = function() {
		apiHandler.setProject()
			.success(function(res) {
				$state.go('projectDetail', { id: res.id });
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 3, msg: err });
			});
	};
}]);