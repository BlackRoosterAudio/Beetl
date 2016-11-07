'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ErrorCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

	// Prequisites
	var errorLookup = [
		{
			message : 'The user could not be created. Please try again later.'
		},
		{
			message : 'No data available. Please try again later.'
		},
		{
			message : 'The catalogue is temporarily or permanently unavailable.'
		},
		{
			message : 'The catalogue could not be created. Please try again later.'
		},
		{
			message : 'The catalogue could not be deleted.'
		},
		{
			message : 'Login failed.',
			back2Login : true
		},
		{
			message : 'No user found.',
			back2Login : true
		}
	];

	// Get Data
	var errorId  = $stateParams.errorId;
	$scope.error = errorLookup[errorId];
}]);