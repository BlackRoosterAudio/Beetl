'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ResultDetailCtrl
 * @description
 * # ResultDetailCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ResultDetailCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'apiHandler', function($scope, $rootScope, $state, $stateParams, apiHandler) {

	// Prequisites
	var resultId       = $stateParams.id;
	$scope.currentUser = $rootScope.currentUser;
	$scope.result      = {};
	$scope.hasError    = false;

	// Grab projects
	apiHandler.getProjectList()
		.success(function(res) {
			$scope.projects = res;
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	// Grab current result
	apiHandler.getResult(resultId)
		.success(function(res) {
			if(res) {
				$scope.result = res;
				$scope.result.data = $scope.result.data || [];
			}
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});
}]);