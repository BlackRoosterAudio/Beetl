'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('SettingsCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.test = null;
	$stateParams.id = null;
}]);