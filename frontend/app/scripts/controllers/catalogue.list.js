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
	$scope.helpers     = $rootScope.helpers;
	$scope.currentUser = $rootScope.currentUser;

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

	var enrichCatalogueList = function() {
		if ($scope.catalogues.length > 0 && $scope.results.length > 0) {
			for (var i = 0; i < $scope.catalogues.length; i++) {
				$scope.catalogues[i].alreadyDone = false;
				for (var j = 0; j < $scope.results.length; j++) {
					if ($scope.currentUser.id == $scope.results[j].testedBy && $scope.results[j].catalogue == $scope.catalogues[i]._id) {
						$scope.catalogues[i].alreadyDone = true;
						console.log('found in', $scope.catalogues[i]);
					}
				}
			}
		}
	};

	/**
	 * The function will initialize the result list
	 */
	var initializeResultList = function() {
		$scope.results = [];
		apiHandler.getResultList()
			.success(function(res) {
				$scope.results = res;
				
				enrichCatalogueList();
			})
			.error(function(err) {
				$state.go('errorPage', { errorId: 1, msg: err });
			});
	};

	/**
	 * The function will initialize the catalogue list
	 */
	var initializeCatalogueList = function() {
		$scope.catalogues = [];
		apiHandler.getCatalogueList()
			.success(function(res) {
				$scope.catalogues = res;

				initializeResultList();
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