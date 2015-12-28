var adminApp = angular.module('adminApp',['ngRoute','ElService']);

adminApp.controller('SubjectCtrl',['$scope','Subject',function($scope,Subject){
	$scope.subjects=Subject.query();
	$scope.subject = {name: null};
	$scope.add = function(){
		//console.log($scope.subject);
		Subject.save($scope.subject,function(){
			$scope.subjects = Subject.query();
		},
		function(){
			console.log("Can't save subject");
		});
		
	};
}]);

adminApp.controller('SectionCtrl',['$scope','$routeParams','Section',function($scope,$routeParams,Section){
	$scope.section = {name: null};
	
	$scope.sections = Section.query({subjectId: $routeParams.subjectId},
			function(){
	},
			function(){
		console.log('Error ...')
	});
	
	$scope.add = function(){
		
		$subjectId = $routeParams.subjectId;
		
		Section.save({subjectId: $subjectId},$scope.section,
				function(){
					$scope.sections = Section.query({subjectId: $routeParams.subjectId})
					},
				function(){console.log("Failed add section ...")});
	};
}]);

adminApp.controller('AddQuestionCtrl',['$scope','$routeParams','Question',function($scope,$routeParams,Question){
	$scope.question = null;
	$scope.answerText = null;
	$scope.answerIsCorrect = false;
	$scope.answers = [];
	
	//display flags
	$scope.showQuestionView = false;
	$scope.showQuestionForm = true;
	$scope.showAnswerForm = false;
	$scope.showSaveQuestionBtn = false;
	
	$scope.model = {
	};
	
	$scope.setQuestionText = function(){
		console.log("Question text is set");
		$scope.showQuestionView = true;
		$scope.showQuestionForm = false;
		$scope.showAnswerForm = true;
	};
	
	$scope.addAnswerToQuestion = function(){
		console.log("Answer added to question");
		
		$scope.answers.push({text: $scope.answerText, isCorrect: $scope.answerIsCorrect});
		
		if($scope.answers.length>1){
			$scope.showSaveQuestionBtn = true;
		}
		$scope.answerText=null;
	};
	
	$scope.saveQuestion = function(){
		console.log("Question saved to db");
		var model = {
					text: $scope.questionText,
					answers: $scope.answers	
					};
		
		console.log(model);
		
		var $sectionId = $routeParams.sectionId;
		
		
		Question.save({sectionId: $sectionId},model,function(){
			console.log("question added to section");
		},function(){
			console.log("failed save question")
		});
		
	};
	
}]);

adminApp.controller('ListQuestionCtrl',['$scope','$routeParams','Question',function($scope,$routeParams,Question){
	
	$sectionId = $routeParams.sectionId;
	$scope.questions = Question.query({sectionId: $sectionId});
	console.log($scope.questions);
}]);


adminApp.controller('ListAddQuizCtrl',['$scope','$routeParams','Quiz',function($scope,$routeParams,Quiz){
	$scope.subjectId = $subjectId = $routeParams.subjectId;
	$scope.quizzes = Quiz.query({subjectId: $subjectId});
	$scope.quizName = null;
	
	$scope.addQuiz = function(){
		Quiz.save({subjectId: $subjectId},{name: $scope.quizName},function(){
			console.log('Success quiz created ...');
			$scope.quizName = null;
			$scope.quizzes = Quiz.query({subjectId: $subjectId});
		},function(){
			console.log('Failed create quiz');
		});
	};
}]);

adminApp.controller('AddQuestionToQuizCtrl',['$scope','$routeParams','Quiz','Section','Question',function($scope,$routeParams,Quiz,Section,Question){
	
	var $subjectId = $routeParams.subjectId;
	
	var $quizId = $routeParams.quizId;  
	
	console.log(" Quiz Id :" + $routeParams.quizId + " Subject Id : " + $routeParams.subjectId);
	
	$scope.quizQuestions = Quiz.getQuestionsByQuizId({quizId: $quizId},
			function(){console.log('Get questions for this quiz');},
			function(){console.log('Failed get questions for this quiz');});
	
	$scope.sectionQuestions = null;
	$scope.section = null;
	$scope.sections = Section.query({subjectId: $subjectId});
	
	console.log($scope.sections);
	
	$scope.changeSection = function(){
		
		var $sectionId = $scope.section.id;
		
		$scope.sectionQuestions = Question.query({sectionId: $sectionId},function(){
			console.log("Questions for sections loaded");
		},function(){
			console.log("Failed load questions for sectionsId " + $secionId);
		})
	};
	
	$scope.addQuestionToQuiz = function(arrayIndex){
		
		$scope.quizQuestions.push($scope.sectionQuestions[arrayIndex]);
		
		Quiz.addQuestionToQuiz({quizId: $quizId, questionId: $scope.sectionQuestions[arrayIndex].id}
		,{},function(){
			console.log("Question succssefuly added to quiz");
		},function(){
			console.log("Failed add question to quiz");
		});
		
		$scope.sectionQuestions.splice(arrayIndex,1);	
	};
	
	$scope.saveQuiz = function(){
		console.log("Try save this question");
	};
}]);

adminApp.controller('PassQuizCtrl',['$scope','$location','Score','Quiz','Question','$routeParams',
                                    function($scope,$location,Score,Quiz,Question,$routeParams){
	var $quizId = $routeParams.quizId;
	console.log('Quiz with id : ' + $quizId);
	var takeQuiz = null;
	var isQuizFinished = false;
	
	$scope.loadQuestion = function(){
		
		var $questionId = takeQuiz.questionIds.shift();
		
		if(!$questionId){
			var pathToResultPage = '/quiz/result/' + takeQuiz.scoreId;
			$location.path(pathToResultPage);
			return;
		}
		$scope.question = Question.getQuestionById({questionId: $questionId});
	};
	
	Quiz.takeQuiz({quizId: $quizId},function(data){
			takeQuiz = data; //question id's
			$scope.loadQuestion();
		},
			function(){
			console.log("failed take quiz");
			}
		);
	
	$scope.answerOnQuestion = function(){
		
		
		var index = 0, length = $scope.question.answers.length, userAnswer;
		var userAnswers = [];
		
		for(index;index<length;index++){
			userAnswer = $scope.question.answers[index]; 
			if(userAnswer.userChoice){
				userAnswers.push(userAnswer.id)
			}
		}
		
		var $scoreId = takeQuiz.scoreId;
		var $questionId = $scope.question.id;
		
		Score.answerOnQuestion({scoreId: $scoreId,questionId: $questionId},userAnswers,
				function(){console.log('Answer suc..');},
				function(){console.log('Answer fuc..')});
		
		$scope.loadQuestion();
	};
	
}]);

adminApp.controller('QuizResultCtrl',['$scope',function($scope){
	$scope.message = 'This is quiz results ..';
}]);

adminApp.config(['$routeProvider',function($routeProvider){
	$routeProvider
	
	.when('/subject',{
		templateUrl: 'view/subject.html',
		controller: 'SubjectCtrl'
	})
	.when('/section/:subjectId',{
		templateUrl: 'view/section.html',
		controller: 'SectionCtrl'
	})
	.when('/add/question/:sectionId',{
		templateUrl: 'view/add_question.html',
		controller: 'AddQuestionCtrl'
	})
	.when('/list/questions/:sectionId',{
		templateUrl: 'view/list_questions.html',
		controller: 'ListQuestionCtrl'
	})
	.when('/list/add/quiz/:subjectId',{
		templateUrl: 'view/quiz.html',
		controller: 'ListAddQuizCtrl'
	})
	.when('/question_quiz/:quizId/:subjectId',{
		templateUrl: 'view/quiz_question.html',
		controller: 'AddQuestionToQuizCtrl'
	})
	.when('/take/quiz/:quizId',{
		templateUrl: 'view/pass_quiz.html',
		controller: 'PassQuizCtrl'	
	})
	.when('/quiz/result/:scoreId',{
		templateUrl: 'view/quiz_result.html',
		controller: 'QuizResultCtrl'
	});
	
	
}])