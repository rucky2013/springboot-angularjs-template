/**
 * Crud service for person 
 */

var CrudService = angular.module('CrudService',['ngResource']);

CrudService.factory('Person',['$resource',function($resource){
	return $resource('/api/person');
}]);