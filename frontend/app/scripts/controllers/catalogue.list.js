'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:CatalogueListCtrl
 * @description
 * # CatalogueListCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('CatalogueListCtrl', ['$scope', '$rootScope', 'apiHandler', '$state', function($scope, $rootScope, apiHandler, $state) {

	// Load helpers
	$scope.helpers = $rootScope.helpers;

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
	 * The function will initialize the catalogue list
	 */
	var initializeCatalogueList = function() {
		$scope.catalogues = [];
		apiHandler.getCatalogueList()
			.success(function(res) {
				$scope.catalogues = res;
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 1, msg: err });
			});
	};

	// Initialize on controller loading
	initializeCatalogueList();

	/**
	 * The function will delete the given catalogue
	 */
	$scope.deleteCatalogue = function(id) {
		apiHandler.deleteCatalogue(id)
			.success(function() {
				initializeCatalogueList();
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 4, msg: err });
			});
	};

	/**
	 * The function will create a new catalogue object
	 */
	$scope.createCatalogue = function() {
		apiHandler.setCatalogue()
			.success(function(res) {
				$state.go('catalogueDetail', { id: res.id });
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 3, msg: err });
			});
	};
}]);