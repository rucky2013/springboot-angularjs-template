var elService = angular.module('ElService',['ngResource']);

elService.factory('Subject',['$resource',function($resource){
	
	var actions = {
		all:{
			method: 'GET',
			url: '/api/subscriber/all/:start/:count',
			params: {start:0, count:10},
			isArray:true
		}
	};
	
	return $resource(
	 '/api/subject',
	 {},
	 {},
	 {stripTrailingSlashes:false}
	);
}]);

elService.factory('Section',['$resource',function($resource){
	return $resource('/api/section/:subjectId',{},{});
}]);

elService.factory('Question',['$resource',function($resource){
	// TODO: refactor this after refactor ElRest
	var actions = {
			getQuestionById: {
				url: '/api/:questionId/question',
				method: 'GET'	
			}
	}
	return $resource('/api/question/:sectionId',{},actions);
}]);

elService.factory('Quiz',['$resource',function($resource){
	var actions = {
			addQuestionToQuiz:{
				method: 'PUT',
				url: '/api/quiz/:quizId/:questionId'
			},
			getQuestionsByQuizId:{
				method: 'GET',
				url: '/api/quiz/questions/:quizId',
				isArray: true
			},
			takeQuiz:{
				method: 'GET',
				url: '/api/quiz/take/:quizId'
			}
		};
	return $resource('/api/quiz/:subjectId',{},actions);
}]);

elService.factory('Score',['$resource',function($resource){
	var actions = {
		answerOnQuestion : {
			url: '/api/score/question/answer/:scoreId/:questionId',
			method: 'PUT'
		}	
	};
	
	return $resource('/api/score/:scoreId',{},actions);
}]);