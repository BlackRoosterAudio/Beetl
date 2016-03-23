'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ResultListCtrl
 * @description
 * # ResultListCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ResultListCtrl', ['$scope', 'apiHandler', '$state', function($scope, apiHandler, $state) {
	
	// Prequisites
	$scope.projects = {};

	// Grab projects
	apiHandler.getProjectList()
		.success(function(res) {
			angular.forEach(res, function(project) {
				$scope.projects[project._id] = project.title;
			});
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	/**
	 * The function will initialize the result list
	 */
	var initializeCatalogueList = function() {
		$scope.results = [];
		apiHandler.getCatalogueList()
			.success(function(res) {
				$scope.results = res;
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 1, msg: err });
			});
	};

	// Initialize on controller loading
	initializeCatalogueList();

	/**
	 * The function will delete the given result
	 */
	$scope.deleteResult = function(id) {
		// TODO: Delte multiple results depending on catalogue
		id = null;
	};
}]);