'use strict';

/**
 * @ngdoc function
 * @name beetlApp.controller:ResultOverviewCtrl
 * @description
 * # ResultOverviewCtrl
 * Controller of the beetlApp
 */
angular.module('beetlApp').controller('ResultOverviewCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'apiHandler', function($scope, $rootScope, $state, $stateParams, apiHandler) {

	// Prequisites
	var catalogueId       = $stateParams.id;
	$scope.currentUser    = $rootScope.currentUser;
	$scope.userList       = [];
	$scope.userListFull   = [];

	// Grab Users
	apiHandler.getUserList()
		.success(function(res) {
			angular.forEach(res, function(user) {
				$scope.userList.push(user._id);
				$scope.userListFull[user._id] = user;
			});
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	// Grab all results based on choosen catalogue
	apiHandler.getResultByCatalogue(catalogueId)
		.success(function(res) {

			if($scope.currentUser && !$scope.currentUser.isAdmin) {
				res = res.filter(function(obj) {
					return obj.testedBy === $scope.currentUser.id;
				});
			};

			$scope.results        = res;
			$scope.countCompleted = 0;
			$scope.reference      = $scope.results[0];

			if(!$scope.results || !$scope.results.length) {
				return;
			}
			
			// Completion
			$scope.total      = $scope.results.length;
			$scope.complete   = countCompleted($scope.results);
			$scope.incomplete = $scope.total - $scope.complete;
			$scope.completion = {
				'labels' : ['Complete (' + $scope.complete + ')' ,'Incomplete (' + $scope.incomplete + ')'],
				'data'   : [$scope.complete,$scope.incomplete],
				'colors' : ['#86AF4F','#C0C0C0']
			};

			// Test Coverage
			$scope.totalSteps    = countSteps($scope.results);
			$scope.failedSteps   = countFailedSteps($scope.results);
			$scope.acceptedSteps = countAcceptedSteps($scope.results);
			$scope.notTested     = $scope.totalSteps - $scope.failedSteps - $scope.acceptedSteps;
			$scope.coverage      = {
				'labels' : ['Failed (' + $scope.failedSteps + ')', 'Accepted (' + $scope.acceptedSteps + ')', 'Not tested (' + $scope.notTested + ')'],
				'data'   : [$scope.failedSteps, $scope.acceptedSteps, $scope.notTested],
				'colors' : ['#EF3C0F', '#86AF4F', '#C0C0C0']
			};

			// Usage
			$scope.totalUsers = $scope.userList.length;
			$scope.totalUsage = countTestUsage($scope.results, $scope.userList);
			$scope.usage      = {
				'labels' : ['Tested (' + $scope.totalUsage + ')', 'Untested (' + ($scope.totalUsers - $scope.totalUsage) + ')'],
				'data'   : [$scope.totalUsage, ($scope.totalUsers - $scope.totalUsage)],
				'colors' : ['#86AF4F', '#C0C0C0']
			};
		})
		.error(function(err) {
			$state.go('errorPage', { errorId: 2, msg: err });
		});

	/**
	 * The function will count, how many of the existing
	 * users have already taken the catalogue
	 * @param  {[array]} resultList [array of result catalogues]
	 * @param  {[array]} userList   [array of users]
	 * @return {[int]}
	 */
	var countTestUsage = function(resultList, userList) {

		var count = [];

		for (var i = 0; i < resultList.length; i++) {
			for (var j = 0; j < userList.length; j++) {
				if(resultList[i].testedBy === userList[j]) {
					if(count.indexOf(userList[j]) < 0) {
						count.push(userList[j]);
					}
				}
			}
		}

		return count.length;
	};

	/**
	 * The function will return the amount of finished
	 * result catalogues
	 * @param  {[object]} resultList
	 * @return {[int]}
	 */
	var countCompleted = function(resultList) {

		var count = 0;

		for (var i = 0; i < resultList.length; i++) {
			var complete = true;
			for (var j = 0; j < resultList[i].data.length; j++) {
				if(resultList[i].data[j].state !== 'accepted' && resultList[i].data[j].state !== 'declined') {
					complete = false;
				}   
			}
			if(complete) {
				count++;
			}
		}

		return count;
	};

	/**
	 * The function will return the total amount of 
	 * results in the list
	 * @param  {[array]} resultList 
	 * @return {[int]}            
	 */
	var countSteps = function(resultList) {
		return (resultList.length * resultList[0].data.length);
	};

	/**
	 * The function will count the overall processed
	 * steps (only declined) and return them as integer
	 * @param  {[array]} resultList
	 * @return {[int]}           
	 */
	var countFailedSteps = function(resultList) {
		
		var count = 0;

		for (var i = 0; i < resultList.length; i++) {
			for (var j = 0; j < resultList[i].data.length; j++) {
				if(resultList[i].data[j].state === 'declined') {
					count++;
				}   
			}
		}

		return count;
	};

	/**
	 * The function will count the overall processed
	 * steps (only accepted) and return them as integer
	 * @param  {[array]} resultList
	 * @return {[int]}           
	 */
	var countAcceptedSteps = function(resultList) {
		
		var count = 0;

		for (var i = 0; i < resultList.length; i++) {
			for (var j = 0; j < resultList[i].data.length; j++) {
				if(resultList[i].data[j].state === 'accepted') {
					count++;
				}   
			}
		}

		return count;
	};
}]);