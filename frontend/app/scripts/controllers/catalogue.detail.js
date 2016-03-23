'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:CatalogueDetailCtrl
 * @description
 * # CatalogueDetailCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('CatalogueDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'apiHandler', function($scope, $rootScope, $state, $stateParams, apiHandler) {

	// Prequisites
	var catalogueId       = $stateParams.id;
	$scope.currentUser    = $rootScope.currentUser;
	$scope.catalogue      = {};
	$scope.hasError       = false;

	// Grab projects
	apiHandler.getProjectList()
		.success(function(res) {
			$scope.projects = res;
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	// Grab current catalogue
	apiHandler.getCatalogue(catalogueId)
		.success(function(res) {
			$scope.catalogue = res;
			$scope.catalogue.data = $scope.catalogue.data || [];
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	/**
	 * The function will remove the selected step from
	 * the list of test steps 
	 */
	$scope.removeStep = function(index) {
		$scope.catalogue.data.splice(index, 1);
	};

	/**
	 * The function will add an aditional step to
	 * the list of test steps (empty slot)
	 */
	$scope.addStep = function() {
		$scope.inserted = {
			id: $scope.catalogue.data.length + 1,
			name: '',
			status: null,
			group: null
		};
		$scope.catalogue.data.push($scope.inserted);
	};
	
	/**
	 * The function will save the current catalogue
	 * to the database (API update request)
	 */
	$scope.saveCatalogue = function(redirect) {
		apiHandler.updateCatalogue($scope.catalogue).success(function() {
			if(redirect) {
				$state.go('catalogueList');
			}
		});
	};
	
	/**
	 * The function will save the current selected
	 * acceptance progress to the database (API set request)
	 * NON-ADMIN-MODE
	 */
	$scope.saveResult = function() {

		var payload = {
			catalogue   : $scope.catalogue._id,
			testedBy	: $rootScope.currentUser.id,
			data  		: $scope.catalogue.data,
			errorNote   : $scope.catalogue.errorNote
		};

		apiHandler.setResult(payload).success(function() {
			$state.go('catalogueList');
		});
	};
	
	/**
	 * The function will accept the selected step 
	 * and update some styling
	 */
	$scope.acceptStep = function(index) {
		$scope.catalogue.data[index].state = 'accepted';
		$scope.catalogue.data[index].class = 'accepted';

		for(var i = 0; i < index; i++) {
			$scope.catalogue.data[i].state = 'accepted';
			$scope.catalogue.data[i].class = 'accepted';
		}
	};
	
	/**
	 * The function will decline the selected step 
	 * and update some styling
	 */
	$scope.declineStep = function(index) {
		$scope.catalogue.data[index].state = 'declined';
		$scope.catalogue.data[index].class = 'declined stop';
		$scope.hasError                    = true;

		for(var i = 0; i < index; i++) {
			$scope.catalogue.data[i].state = 'accepted';
			$scope.catalogue.data[i].class = 'accepted';
		}

		for(var j = (index + 1); j < $scope.catalogue.data.length; j++) {
			$scope.catalogue.data[j].state = 'undone';
			$scope.catalogue.data[j].class = 'undone';
		}
	};
}]);