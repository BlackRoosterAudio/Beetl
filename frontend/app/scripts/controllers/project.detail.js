'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ProjectDetailCtrl
 * @description
 * # ProjectDetailCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ProjectDetailCtrl', ['$scope', '$state', '$stateParams', 'apiHandler', function($scope, $state, $stateParams, apiHandler) {
	
	// Prequisites
	var projectId       = $stateParams.id;
	$scope.project      = {};

	/**
	 * Function will call the API for project by ID
	 */
	apiHandler.getProject(projectId)
		.success(function(res) {
			$scope.project = res;
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	/**
	 * Function will send the current project object
	 * to the API
	 * @param  {boolean} redirect [return to projectList]
	 */
	$scope.saveProject = function(redirect) {
		apiHandler.updateProject($scope.project).success(function() {
			if(redirect) {
				$state.go('projectList');
			}
		});
	};
}]);