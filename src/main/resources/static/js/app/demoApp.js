/***
 * This is simple Spring Boot + Angular Demo application 
 */

var demoApp = angular.module('demoApp',['ngRoute']);

demoApp.controller('CrudCtrl',['$scope',function($scope){
	
}]);

demoApp.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'view/person.html',
		controller: 'CrudCtrl'
	});
}]);