/***
 * This is simple Spring Boot + Angular Demo application 
 */

var demoApp = angular.module('demoApp',['ngRoute','CrudService']);

demoApp.controller('CrudCtrl',['$scope','Person',function($scope,Person){
	$scope.person = {fistName:undefined,lastName:undefined};
	
	$scope.refresh = function(){
		$scope.people = Person.query();
	};
	
	$scope.refresh();
	
	$scope.save = function(){
		Person.save($scope.person
				, function(){
					$scope.person.firstName = undefined;
					$scope.person.lastName = undefined;
					$scope.refresh();
					console.log("Person saved");
				}
				, function(){console.log("Failed save person")});
	};
	
	$scope.delete = function(person){
		console.log(person._links.self.href);
		Person.delete({id:person.id},
				function(){
			console.log("Success ...");
			$scope.refresh();
		},
		function(){
			console.log("Failed delete person");
		});
		console.log(person._links.self.href);
	};
	
}]);

demoApp.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'view/person.html',
		controller: 'CrudCtrl'
	});
}]);