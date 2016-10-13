'use strict';

/**
 * @ngdoc function
 * @name beetlApp.factory:apiHandler
 * @description
 * # apiHandler
 * Factory of the beetlApp
 */

angular.module('beetlApp').factory('apiHandler', ['$http', function($http) {

    // Set standard content-type for all requests
    $http.defaults.headers.common['Content-Type'] = 'application/json';

    // Prequisites
    var urlBase     = 'http://beetl.blackroosteraudio.com:8091';
    var apiHandler  = {};

    // Authentication
    apiHandler.login = function(objCredentials) {
        return $http.post(urlBase + '/auth/', objCredentials);
    };

    // User management
    apiHandler.getUserList = function () {
        return $http.get(urlBase + '/user');
    };

    apiHandler.getUser = function (id) {
        return $http.get(urlBase + '/user/' + id);
    };

    apiHandler.setUser = function (objUser) {
        return $http.post(urlBase + '/user/', objUser);
    };

    apiHandler.updateUser = function (objUser) {
        return $http.put(urlBase + '/user/' + objUser._id, objUser);
    };

    apiHandler.deleteUser = function (id) {
        return $http.delete(urlBase + '/user/' + id);
    };

    // Catalogue Management
    apiHandler.getCatalogueList = function () {
        return $http.get(urlBase + '/catalogue');
    };

    apiHandler.getCatalogue = function (id) {
        return $http.get(urlBase + '/catalogue/' + id);
    };

    apiHandler.setCatalogue = function () {
        return $http.post(urlBase + '/catalogue', { title : 'New Catalogue' });
    };

    apiHandler.updateCatalogue = function (objCatalogue) {
        return $http.put(urlBase + '/catalogue/' + objCatalogue._id, objCatalogue);
    };

    apiHandler.deleteCatalogue = function (id) {
        return $http.delete(urlBase + '/catalogue/' + id);
    };

    // Project Management
    apiHandler.getProjectList = function () {
        return $http.get(urlBase + '/project');
    };

    apiHandler.getProject = function (id) {
        return $http.get(urlBase + '/project/' + id);
    };

    apiHandler.setProject = function () {
        return $http.post(urlBase + '/project', { title : 'New Project' });
    };

    apiHandler.updateProject = function (objProject) {
        return $http.put(urlBase + '/project/' + objProject._id, objProject);
    };

    apiHandler.deleteProject = function (id) {
        return $http.delete(urlBase + '/project/' + id);
    };

    // Result Management
    apiHandler.getResultList = function () {
        return $http.get(urlBase + '/result');
    };

    apiHandler.getResult = function (resultId) {
        return $http.get(urlBase + '/result/' + resultId);
    };

    apiHandler.getResultByCatalogue = function (catalogueId) {
        return $http.get(urlBase + '/result/catalogue/' + catalogueId);
    };

    apiHandler.setResult = function (objResult) {
        return $http.post(urlBase + '/result', objResult);
    };

    apiHandler.updateResult = function (objResult) {
        return $http.put(urlBase + '/result/' + objResult._id, objResult);
    };

    apiHandler.deleteResult = function (id) {
        return $http.delete(urlBase + '/result/' + id);
    };

    return apiHandler;
}]);