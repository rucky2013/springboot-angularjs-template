var searchApp = angular.module('elApp',['elService']);

searchApp.controller('SearchCtrl',function($scope,Subscriber,Location){
	
	$scope.filterData = {
			start:0,
			count:10
			};
	
	$scope.reset = function(){
		console.log("Reset action ... Not Implemented");
	};
	
	$scope.next = function(){
		
		$scope.filterData.start = $scope.filterData.start + $scope.filterData.count;
		$scope.filter(true);
	};
	
	$scope.previos = function(){
		
		var temp = $scope.filterData.start - $scope.filterData.count;
		if(temp<0) return;
		$scope.filterData.start = temp;
		$scope.filter(true);
	};
	
	$scope.filter = function(isPagination){
		
		if(!isPagination) $scope.filterData.start=0;
		
		$scope.subscribers = Subscriber.filter(null,$scope.filterData);
		console.log("RegionId : " + $scope.filterData.regionId);
	};
	
	//init service call's
	$scope.regions = Location.region();
	$scope.filter();
	
});
