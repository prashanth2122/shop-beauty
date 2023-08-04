var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function() {
  return Window._;
}]);
// export const module = angular.module('AngularJsModule', []);
var moltonBrownQuizApp = angular.module("moltonBrownApp", ['ngSanitize', 'underscore']);

var emailIsValid = false;

moltonBrownQuizApp.controller("QuizController", [ '$scope', '$http', '$sce', '$timeout','$window', function($scope, $http, $sce, $timeout,$window, _) {
	$window.onload = function (e) {
		if(e.currentTarget.location.pathname =="/store/fragrance/fragrance-finder/UKFF"){
			$scope.welcomeStep = true; 
		}
	}
	$scope.welcomeStep = true; 
	//this request is to the json which holds ALL the questions for the quiz
	$http({
		method: 'GET',
		url: 'assets/resource/data/uk/molton-brown.json'
	}).then(function (res) {

		// Email validation
		var validateEmail = function(e) {
			var emailAddress = (e != undefined)?$(e.currentTarget).val():"";
			var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
			emailIsValid = pattern.test(emailAddress);
			
			//If email is valid and T&Cs checkbox ticked
			if( emailIsValid && $('#email-cb-2').prop('checked'))
			{
				$scope.gdprCheck = false;
				$scope.$apply(); //force model to update
			}
			else
			{
				$scope.gdprCheck = true;
				$scope.$apply(); //force model to update
			}
		};

		// Check happening on key up as well as focus in/out
		$("[name*='emailInput']").keyup(validateEmail);
		$("[name*='emailInput']").focusin(validateEmail);
		$("[name*='emailInput']").focusout(validateEmail);
		
		let preference = res.data[0].preference;
		let attraction = res.data[0].preference[0].character[0].attraction;
		let articulation = res.data[0].preference[0].character[0].articulation;
		let functionChar = res.data[0].preference[0].character[0].function;
		
		$scope.gdprCheck = true;
		
		$scope.preference = preference;
			$scope.prefQOne = shuffleQuestion(preference[0].questions[0].question_one); //this is to shuffle the questions and I passed it into the view
			$scope.prefQTwo = shuffleQuestion(preference[0].questions[0].question_two);
			$scope.prefQThree = shuffleQuestion(preference[0].questions[0].question_three);
			$scope.prefQFour = shuffleQuestion(preference[0].questions[0].question_four);
			
		$scope.attraction = attraction;
			$scope.attrQOne = shuffleQuestion(attraction[0].questions[0].question_one);
			$scope.attrQTwo = shuffleQuestion(attraction[0].questions[0].question_two);
			$scope.attrQThree = shuffleQuestion(attraction[0].questions[0].question_three);
			$scope.attrQFour = shuffleQuestion(attraction[0].questions[0].question_four);

			$scope.attrIndQ = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_select);
			$scope.attrIndQEdt = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edt);
			$scope.attrIndQEdp = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edp);

			$scope.attrIndMindQOne = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
			$scope.attrIndMindQTwo = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
			$scope.attrIndMindQThree = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
			$scope.attrIndMindQFour = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);

			$scope.attrBalMindQOne = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
			$scope.attrBalMindQTwo = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
			$scope.attrBalMindQThree = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
			$scope.attrBalMindQFour = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);

			$scope.attrGiveQ = shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_select);
			$scope.attrGiveQEdt = shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edt);
			$scope.attrGiveQEdp = shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edp);

			$scope.attrGiveMindQOne = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
			$scope.attrGiveMindQTwo = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
			$scope.attrGiveMindQThree = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
			$scope.attrGiveMindQFour = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);

		
		$scope.articulation = articulation;
			$scope.articuQOne = shuffleQuestion(articulation[0].questions[0].question_one);
			$scope.articuQTwo = shuffleQuestion(articulation[0].questions[0].question_two);
			$scope.articuQThree = shuffleQuestion(articulation[0].questions[0].question_three);
			$scope.articuQFour = shuffleQuestion(articulation[0].questions[0].question_four);

			$scope.articuIndQ = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].fragrance_select);

			$scope.articuIndMindQOne = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
			$scope.articuIndMindQTwo = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
			$scope.articuIndMindQThree = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
			$scope.articuIndMindQFour = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);

			$scope.articuBalQ = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_select);
			$scope.articuBalQEdt = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edt);
			$scope.articuBalQEdp = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edp);

			$scope.articuBalMindQOne = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
			$scope.articuBalMindQTwo = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
			$scope.articuBalMindQThree = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
			$scope.articuBalMindQFour = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);

			$scope.articuGiveQ = shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_select);
			$scope.articuGiveQEdt = shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edt);
			$scope.articuGiveQEdp = shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edp);

			$scope.articuGiveMindQOne = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
			$scope.articuGiveMindQTwo = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
			$scope.articuGiveMindQThree = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
			$scope.articuGiveMindQFour = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);

		$scope.function = functionChar;
			$scope.funcQOne = shuffleQuestion(functionChar[0].questions[0].question_one);
			$scope.funcQTwo = shuffleQuestion(functionChar[0].questions[0].question_two);
			$scope.funcQThree = shuffleQuestion(functionChar[0].questions[0].question_three);
			$scope.funcQFour = shuffleQuestion(functionChar[0].questions[0].question_four);

			$scope.funcBalMindQOne = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
			$scope.funcBalMindQTwo = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
			$scope.funcBalMindQThree = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
			$scope.funcBalMindQFour = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);

			$scope.funcGiveQ = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_select);
			$scope.funcGiveQEdt = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edt);
			$scope.funcGiveQEdp = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edp);

			$scope.funcGiveMindQOne = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
			$scope.funcGiveMindQTwo = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
			$scope.funcGiveMindQThree = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
			$scope.funcGiveMindQFour = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);

		

	},function(err) {
		console.log(err)
	});


	


	function shuffleQuestion(array) {
		var m = array.length, t, i;
			while (m) {
				i = Math.floor(Math.random() * m--);
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}
			return array;
	}
	

	
	//this function is called once the user hits reveal my fragrance
	function getPersonality(profile, identity ) {
		
		$scope.loadResults = true;
		$scope.getBGImg.active = true;
		$scope.showResults = false;
		$scope.showSteps = false;

		$timeout(function() {
			$scope.loadResults = false;
			$scope.showResults = true;
			$scope.primaryResults = true;
			$scope.getBGImg.active = false;
			$scope.getBGImg.initialProfile = false;
			$scope.getBGImg.finalProfile = false;
			$scope.getBGImg.resultsPage = true;

			//this request calls the json which holds ALL the products and profiles
			$http({
				method: 'GET',
				url: 'assets/resource/data/uk/quiz-results.json',
			}).then(function (res) {
				//	console.log('lets see whats up', res.data.results.persona)
					var fragID = res.data.results.persona;
					$scope.secProdCB0 = true;
					$scope.secProdCB1 = true;
					$scope.priProdCB = true;
					$scope.primaryProductCB = true;
					$scope.secondaryProductCB0 = true;
					$scope.secondaryProductCB1 = true;
					$scope.checkoutProducts = true; //this button is disabled until the user checks 2 samples
					$scope.gdprCheck = true; //this button is disabled until the user checks BOTH GDPR boxes

					fragID.filter(function (persona)  {
					
				
						if(persona.id === profile) {
							let mainProfile = persona.profile[0];
							let fragrance = persona.fragrance[0];
							if(localStorage.getItem('prefered_lng')){
								const _basesite=JSON.parse(localStorage.getItem('prefered_lng'));
								localStorage.setItem(_basesite.personaId,JSON.stringify({_id:persona.id,_identity:identity}));
							}							
							$scope.profileType = mainProfile.type;
							$scope.profileSecType = mainProfile.secondary_type;
							$scope.profileDesc = mainProfile.copy_one.replace(/\n/g, "<br />");
							$scope.profileDescTwo = mainProfile.copy_two.replace(/\n/g, "<br />");
							$scope.profileImgUrl = persona.imgUrl;

							$scope.fragranceName = fragrance.name.replace(/\n/g, "<br />");
							$scope.fragranceCopy = fragrance.copy;

							$scope.secondaryProfile = persona.secondary;

							var scentID = persona.identity;
								scentID.filter(function (user) {
										if(user.id === identity) {
											$scope.identityCopy = user.copy;
										}
								});

								//sets the background image depending on the users profile
								var backgroundImg = persona.bgImg;

								switch(backgroundImg) {
									case "blackPepper":
										$scope.getBGImg.blackPepper = true;
									break;
									case "bushukan":
										$scope.getBGImg.bushukan = true;
									break;
									case "coastalCypress":
										$scope.getBGImg.coastalCypress = true;
									break;	
									case "floraLuminaire":
										$scope.getBGImg.floraLuminaire = true;
									break;
									case "geranium":
										$scope.getBGImg.geranium = true;
									break;
									case "gingerlily":
										$scope.getBGImg.gingerlily = true;
									break;
									case "jasmineSunRose":
										$scope.getBGImg.jasmineSunRose = true;
									break;	
									case "orangeBergamot":
										$scope.getBGImg.orangeBergamot = true;
									break;
									case "oudh":
										$scope.getBGImg.oudh = true;
									break;
									case "pinkPepper":
										$scope.getBGImg.pinkPepper = true;
									break;
									case "rosaAbsolute":
										$scope.getBGImg.rosaAbsolute = true;
									break;	
									case "russianLeather":
										$scope.getBGImg.russianLeather = true;
									break;
									case "suedeOrris":
										$scope.getBGImg.suedeOrris = true;
									break;
									case "tobaccoAbsolute":
										$scope.getBGImg.tobaccoAbsolute = true;
									break;
									case "vetiverGrapefruit":
										$scope.getBGImg.vetiverGrapefruit = true;
									break;
								}
								
							}
					});
					console.log('the profile is',profile, ' identity is',identity );
					gtag('event', 'results', {
						'event_category': 'Results',
						'event_label': identity
					});
			},function(err) {
				console.log(err);
			});
		}, 5000);
	}
	
	let prefArray = [];

	let charactarArray = [];

	let sampleArray = [];
	
	let mindsetArray = [];

	let fragArray = [];
	
	let prefQuestionFour = false;
	let charQuestionFour = false;

	let mindsetTQuestions = false;
	let mindsetPQuestions = false;

	//this is to test, set this back ot true once finished 
	//$scope.showResults = true; //this is to show the results page while buuilding it, delete line once finished
	//$scope.loadResults = true;
	
	//$scope.loadResults = true; //set this to true to loading page delete once finished

	$scope.beginExp = function() {
		$scope.welcomeStep = false;

		$scope.showSteps = true;
		$scope.showPref = true;
		$scope.startStep1 = true;
		$scope.activeStage1 = true;
		$scope.getBGImg.active = true;
		$scope.getBGImg.initialProfile = true;

		gtag('event', 'begin', {
			'event_category': 'Begin Quiz',
			'event_label': 'Begin Quiz'
		});
		
	};

	var check1 = false;
	var commsCheck = false;
	var tcsCheck = false;

	//logic for the checkboxes
	$scope.primaryCheckbox = function(index) {

		if(index.checked) {
			check1 = true;

			angular.forEach($scope.secondaryProfile, function (value, key) { 
				if($scope.secondaryProfile[0].checked ) {
					
					$scope.priProdCB = false;
					$scope.priProdSelected = true;

					$scope.secProdCB0 = false;
					$scope.secProdCB1 = false;

					$scope.secProdSelected0 = true;
					$scope.secProdNotAvailable1 = true;

					$scope.secondaryProductCB1 = false;

					$scope.checkoutProducts = false;
				} else if( $scope.secondaryProfile[1].checked) {
					
					$scope.priProdCB = false;
					$scope.priProdSelected = true;

					$scope.secProdCB0 = false;
					$scope.secProdCB1 = false;

					$scope.secProdSelected1 = true;
					$scope.secProdNotAvailable0 = true;

					$scope.secondaryProductCB0 = false;

					$scope.checkoutProducts = false;
				}
			});
		} else {
			check1 = false;

			angular.forEach($scope.secondaryProfile, function (value, key) { 
				if($scope.secondaryProfile[0].checked || $scope.secondaryProfile[1].checked  ) {
					
					$scope.priProdCB = true;
					$scope.priProdSelected = false;

					$scope.secProdCB0 = true;
					$scope.secProdCB1 = true;

					$scope.secProdSelected0 = false;
					$scope.secProdSelected1 = false;

					$scope.secProdNotAvailable0 = false;
					$scope.secProdNotAvailable1 = false;

					$scope.primaryProductCB = true;
					$scope.secondaryProductCB0 = true;
					$scope.secondaryProductCB1 = true;

					$scope.checkoutProducts = true;
				}
			});
		}
		
	}
	
	$scope.secondaryCheckbox = function(index) {
	
		angular.forEach($scope.secondaryProfile, function (value, key) {
			var secondaryCB = $scope.secondaryProfile[key].checked;
		

			if(secondaryCB) {			
				if($scope.secondaryProfile[0].checked && check1) {
					console.log('hide second option')
					$scope.secProdCB1 = false;
					$scope.secProdNotAvailable1 = true;
					$scope.secondaryProductCB1 = false;

					$scope.secProdCB0 = false;
					$scope.secProdSelected0 = true;

					$scope.priProdCB = false;
					$scope.priProdSelected = true;

					$scope.checkoutProducts = false;

				} else if($scope.secondaryProfile[1].checked && check1) {
					$scope.secProdCB0 = false;
					$scope.secProdNotAvailable0 = true;
					$scope.secondaryProductCB0 = false;

					$scope.secProdCB1 = false;
					$scope.secProdSelected1 = true;

					$scope.priProdCB = false;
					$scope.priProdSelected = true;

					$scope.checkoutProducts = false;

				} else if ($scope.secondaryProfile[0].checked && $scope.secondaryProfile[1].checked) {
					
					$scope.priProdCB = false;
					$scope.priProdNotAvailable = true;
					$scope.primaryProductCB = false;

					$scope.secProdCB0 = false;
					$scope.secProdCB1 = false;

					$scope.secProdSelected0 = true;
					$scope.secProdSelected1 = true;

					$scope.checkoutProducts = false;
				}
				
			} else {
				if ($scope.secondaryProfile[0].checked && !check1 && !$scope.secondaryProfile[1].checked) {
					$scope.priProdCB = true;
					$scope.priProdSelected = false;
					$scope.priProdNotAvailable = false;
					$scope.primaryProductCB = true;

					$scope.secProdCB0 = true;
					$scope.secProdSelected0 = false;
					$scope.secProdNotAvailable0 = false;
					$scope.secondaryProductCB0 = true;

					$scope.secProdCB1 = true;
					$scope.secProdSelected1 = false;
					$scope.secProdNotAvailable1 = false;
					$scope.secondaryProductCB1 = true;

					$scope.checkoutProducts = true;

				} else if ($scope.secondaryProfile[1].checked && !check1 && !$scope.secondaryProfile[0].checked) {
					$scope.priProdCB = true;
					$scope.priProdSelected = false;
					$scope.priProdNotAvailable = false;
					$scope.primaryProductCB = true;

					$scope.secProdCB0 = true;
					$scope.secProdSelected0 = false;
					$scope.secProdNotAvailable0 = false;
					$scope.secondaryProductCB0 = true;

					$scope.secProdCB1 = true;
					$scope.secProdSelected1 = false;
					$scope.secProdNotAvailable1 = false;
					$scope.secondaryProductCB1 = true;

					$scope.checkoutProducts = true;

				} else if (!$scope.secondaryProfile[1].checked && check1 && !$scope.secondaryProfile[0].checked) {
					$scope.priProdCB = true;
					$scope.priProdSelected = false;
					$scope.priProdNotAvailable = false;
					$scope.primaryProductCB = true;

					$scope.secProdCB0 = true;
					$scope.secProdSelected0 = false;
					$scope.secProdNotAvailable0 = false;
					$scope.secondaryProductCB0 = true;

					$scope.secProdCB1 = true;
					$scope.secProdSelected1 = false;
					$scope.secProdNotAvailable1 = false;
					$scope.secondaryProductCB1 = true;

					$scope.checkoutProducts = true;
				}
			}
			}); 
	}
	
	$scope.submitEmail = function() {

		console.log('sending email'); //TO REMOVE WHEN EMAIL MECHANISM IMPLEMENTED

	};

	$scope.tcs = function(index) {
		if(index.checked) {
			tcsCheck = true;
			
			// if T&Cs checked, verify if email is valid
			if(emailIsValid) {
				// All good to go!
				$scope.gdprCheck = false;
			} else {
				$scope.gdprCheck = true;
			}
		} else {
			tcsCheck = false;
			$scope.gdprCheck = true;
		}
	}
	
	//shows the final page of the users profile
	$scope.showFinalResults = function() {
		// $scope.primaryResults = false;
		// $scope.getBGImg.finalProfile = true;
		// $scope.secondaryResults = true;
		window.location.href="/store/fragrance/fragrance-finder/displayFFProducts";
	}
	
	//holds all the bg imgs, depending on the chosen profile one will be active to display the image
$scope.getBGImg = { blackPepper: false,bushukan: false, coastalCypress:false, floraLuminaire:false, geranium:false, 
										gingerlily:false, jasmineSunRose:false, orangeBergamot:false, oudh:false,
										pinkPepper:false, rosaAbsolute:false, russianLeather:false, suedeOrris:false, 
										tobaccoAbsolute:false, vetiverGrapefruit:false, active:false, resultsPage:false, initialProfile:false, finalProfile:false }

//this is to keep the gif looping
var gifURL = "assets/resource/img/loading.gif";
var random = (new Date()).toString();
$scope.gifUrl = gifURL + '?moltongif=' + random;

	//this counts how many times a user has selected an option, for the weighted logic
	function compareArray(a, type, parent) {
		
		var count1 = 0, count2 = 0, count3 = 0;
		for(var i = 0; i < a.length; ++i){
		    if(a[i] == 1) {
		    	count1++;
		    } else if(a[i]== 2) {
		    	count2++;
		    } else if(a[i]== 3) {
		    	count3++;
		    }
		}
		
		switch(type) { //the start of the quiz user will chose which branch they will enter. 
			case "preference": 
				
				if( count1 >= 2) {
					//show attraction
					$scope.showPref = false;

					$scope.showAttract = true;
					$scope.attractionQuestions = true;
					$scope.showAttractStep1 = true;
					console.log('Chose Attraction');
					$scope.activeStage2 = true;
					} else if (count2 >= 2) {
						$scope.showPref = false;
						$scope.showArticu = true;
						$scope.articulationQuestions = true;
						$scope.showArticuStep1 = true;
						console.log('Chose Articulation');
						$scope.activeStage2 = true;
					} else if (count3 >= 2) {
						$scope.showPref = false;
						$scope.showFunc = true;
						$scope.functionQuestions = true;
						$scope.showFuncStep1 = true;
						console.log('Chose Function');
						$scope.activeStage2 = true;
					} else {
					prefQuestionFour = true;
					$scope.startStep4 = true;

				}
			break;
			case "attraction":
			
				if( count1 >= 2) {
					
					console.log('Chose Indulgent,', 'Parent is ', type);
					$scope.attractionQuestions = false;
					$scope.attractIndulgentQuestions = true;
				
					$scope.indQuestions = true;
					$scope.indMainTitle = true;
					$scope.activeStage3 = true;
					
				} else if(count2 >= 2) {

					console.log('Chose Balanced,', 'Parent is ', type);

					$scope.attractionQuestions = false;
					$scope.attractBalancedQuestions = true;
					$scope.balMindsetQuestions = true;

					$scope.showBalMindsetStep1 = true;

					sampleArray.push('T109');

					$scope.activeStage3 = true;
					$scope.activeStage4 = true;
					//console.log(sampleArray)

				} else if( count3 >= 2) {
					console.log('Chose Giving,', 'Parent is ', type);
					$scope.attractionQuestions = false;

					$scope.attractGivingQuestions = true;
					$scope.giveMainTitle = true;

					$scope.giveQuestions = true;
					$scope.activeStage3 = true;
				} else {
					charQuestionFour = true;
					$scope.showAttractStep4 = true;
				}
			break;
			case "articulation":
				if( count1 >= 2) {
						
					$scope.articulationQuestions = false;
					$scope.articuIndulgentQuestions = true;
				
					$scope.articuIndMainTitle = true;

					$scope.articuIndQuestions = true;

					$scope.activeStage3 = true;

					console.log('Chose Indulgent,', 'Parent is ', type);
					
				} else if(count2 >= 2) {

					$scope.articulationQuestions = false;
					$scope.articuBalancedQuestions = true;

					$scope.articuBalMainTitle = true;

					$scope.articuBalQuestions = true;
					
					$scope.activeStage3 = true;

					console.log('Chose Balanced,', 'Parent is ', type);

				} else if( count3 >= 2) {
					
					$scope.articulationQuestions = false;
					$scope.articuGivingQuestions = true;

					$scope.articuGiveMainTitle = true;

					$scope.articuGiveQuestions = true;

					$scope.activeStage3 = true;

					console.log('Chose Giving,', 'Parent is ', type);

				} else {
					charQuestionFour = true;
					$scope.showArticuStep4 = true;
				}
			break;
			case "function":
				if(count2 >= 2) {

					$scope.functionQuestions = false;
					$scope.funcBalancedQuestions = true;
					$scope.funcBalMindsetQuestions = true;

					$scope.showFuncBalMindsetStep1 = true;

					sampleArray.push('T307');

					$scope.activeStage3 = true;
					$scope.activeStage4 = true;

					console.log('Chose Balanced,', 'Parent is ', type);

				} else if( count3 >= 2) {
					console.log('Chose Giving,', 'Parent is ', type);

					$scope.functionQuestions = false;
					$scope.funcGivingQuestions = true;

					$scope.funcGiveMainTitle = true;

					$scope.funcGiveQuestions = true;

					$scope.activeStage3 = true;

				} else {
					//show step4 for function
					$scope.showFuncStep4 = true;
					charQuestionFour = true;
				}
			break;
			case "mindset":
				if( count1 >= 2) {
					fragArray.push("A");
					
					$scope.showAttract = false;
					$scope.showArticu = false;
					$scope.showFunc = false;
				
					console.log('We are now in ',type, ', Parent is ', parent);
					let finalArray = sampleArray[0].concat(fragArray[0]);
					$scope.finalResults = finalArray;
					console.log('sample is', sampleArray[0]);

					$scope.activeStage5 = true;

					getPersonality(sampleArray[0], finalArray )
				} else if (count2 >= 2) {
					fragArray.push("E");
					
					$scope.showAttract = false;
					$scope.showArticu = false;
					$scope.showFunc = false;
					console.log('We are now in ',type, ', Parent is', parent);

					let finalArray = sampleArray[0].concat(fragArray[0]);

					$scope.showResults = true;
					$scope.finalResults = finalArray;
					console.log('sample is', sampleArray[0]);
					$scope.activeStage5 = true;

					getPersonality(sampleArray[0], finalArray )
				} else if (count3 >= 2) {
					fragArray.push("S");

					$scope.showAttract = false;
					$scope.showArticu = false;
					$scope.showFunc = false;
				
					console.log('We are now in ',type, ', Parent is', parent);
					let finalArray = sampleArray[0].concat(fragArray[0]);
					console.log('sample is', sampleArray[0]);
					$scope.showResults = true;
					$scope.finalResults = finalArray;

					$scope.activeStage5 = true;

					getPersonality(sampleArray[0], finalArray )
				} else {
					if(parent === "attractIndulgent") {
						$scope.showIndMindsetStep4 = true;
					} if(parent === "attractBalanced") {
						$scope.showBalMindsetStep4 = true;
					} else if(parent === "attractGiving") {
						$scope.showGiveMindsetStep4 = true;
					}else if(parent === "artIndulgent") {
						$scope.showArticuIndMindsetStep4 = true;
					} else if(parent === "artBalanced") {
					$scope.showArticuBalMindsetStep4 = true;
					} else if( parent === "artGiving") {
						$scope.showArticuGiveMindsetStep4 = true;
					} else if( parent === "funcBalanced") {
						$scope.showFuncBalMindsetStep4 = true;
					} else if(parent === "funcGiving") {
						$scope.showFuncGiveMindsetStep4 = true;	
					}
				
				}
			break;
		}
	}
	
	$scope.showGDPR = function() {
			$scope.gdprPopUp = true;
	}
	//resets everything
	$scope.restartExp = function() {

		gtag('event', 'restart', {
			'event_category': 'Restart Quiz'
		});

		var random2 = Math.random();
		$scope.gifUrl = gifURL + '?moltongif=' + random2;

		$scope.getBGImg = { blackPepper: false,bushukan: false, coastalCypress:false, floraLuminaire:false, geranium:false, 
			gingerlily:false, jasmineSunRose:false, orangeBergamot:false, oudh:false,
			pinkPepper:false, rosaAbsolute:false, russianLeather:false, suedeOrris:false, 
			tobaccoAbsolute:false, vetiverGrapefruit:false, active:false, resultsPage:false, initialProfile:false, finalProfile:false }

		 $scope.welcomeStep = true;
		 
		 charactarArray = [];
		 prefArray = [];
		 sampleArray = [];
		 fragArray = [];
		 mindsetArray = [];

		 prefQuestionFour = false;
		 charQuestionFour = false;
 
		 mindsetTQuestions = false;
		 mindsetPQuestions = false;
		 
		
		$scope.priProdCB = true;
		$scope.primaryProductCB = true;
		$scope.priProdSelected = false;
		$scope.priProdNotAvailable = false;

		$scope.secondaryProductCB0 = true;
		$scope.secondaryProductCB1 = true;
		$scope.secProdCB0 = true;
		$scope.secProdCB1 = true;
		$scope.secProdSelected0 = false;
		$scope.secProdSelected1 = false;
		$scope.secProdNotAvailable0 = false;
		$scope.secProdNotAvailable1 = false;

		$scope.checkoutProducts = true;
		$scope.gdprCheck = true;

		 $scope.showSteps = false;
		 $scope.activeStage2 = false;
		 $scope.activeStage3 = false;
		 $scope.activeStage4 = false;
		 $scope.activeStage5 = false;
		 $scope.getBGImg.active = false;
		 $scope.showResults = false;

		 $scope.loadResults = false;
		 $scope.showResults = false;
		 $scope.primaryResults = false;
		 $scope.secondaryResults = false;

		 $scope.getBGImg.initialProfile = false;
		 $scope.getBGImg.finalProfile = false;
		 $scope.getBGImg.resultsPage = false;

		 $scope.beginStep = false;
		 $scope.showPref = false;
		 $scope.startStep1 = false;
		 $scope.startStep2 = false;
		 $scope.startStep3 = false;
		 $scope.startStep4 = false;
		 
		$scope.showAttract = false;
		$scope.attractionQuestions = false;
		$scope.showAttractStep1 = false; //to 4
		$scope.showAttractStep2 = false;
		$scope.showAttractStep3 = false;
		$scope.showAttractStep4 = false;

				$scope.attractIndulgentQuestions = false; 
				$scope.indMainTitle = false;
				$scope.indMindsetTitle = false;
				$scope.indQuestions = false;
				$scope.indTQuestions = false;
				$scope.indPQuestions = false;
				$scope.indMindsetQuestions = false;
				$scope.showIndMindsetStep1 = false;
				$scope.showIndMindsetStep2 = false;
				$scope.showIndMindsetStep3 = false;
				$scope.showIndMindsetStep4 = false;

				$scope.attractBalancedQuestions = false; 
				$scope.balMindsetQuestions = false;
				$scope.showBalMindsetStep1 = false;
				$scope.showBalMindsetStep2 = false;
				$scope.showBalMindsetStep3 = false;
				$scope.showBalMindsetStep4 = false;

				$scope.attractGivingQuestions = false;
				$scope.giveMainTitle = false;
				$scope.giveMindsetTitle = false;
				$scope.giveQuestions = false;
				$scope.giveTQuestions = false;
				$scope.givePQuestions = false;
				$scope.giveMindsetQuestions = false;
				$scope.showGiveMindsetStep1 = false;
				$scope.showGiveMindsetStep2 = false;
				$scope.showGiveMindsetStep3 = false;
				$scope.showGiveMindsetStep4 = false;

		$scope.showArticu = false;
		$scope.articulationQuestions = false;
		$scope.showArticuStep1 = false; //to 4
		$scope.showArticuStep2 = false;
		$scope.showArticuStep3 = false;
		$scope.showArticuStep4 = false;

				$scope.articuIndulgentQuestions = false; 
				$scope.articuIndMainTitle = false;
				$scope.articuIndMindsetTitle = false;
				$scope.articuIndQuestions = false;
				
				$scope.articuIndMindsetQuestions = false;
				$scope.showArticuIndMindsetStep1 = false;
				$scope.showArticuIndMindsetStep2 = false;
				$scope.showArticuIndMindsetStep3 = false;
				$scope.showArticuIndMindsetStep4 = false;

				$scope.articuBalancedQuestions = false; 
				$scope.articuBalMainTitle = false;
				$scope.articuBalMindsetTitle = false;
				$scope.articuBalQuestions = false;
				$scope.articuBalTQuestions = false;
				$scope.articuBalPQuestions = false;
				$scope.articuBalMindsetQuestions = false;
				$scope.showArticuBalMindsetStep1 = false;
				$scope.showArticuBalMindsetStep2 = false;
				$scope.showArticuBalMindsetStep3 = false;
				$scope.showArticuBalMindsetStep4 = false;

				$scope.articuGivingQuestions = false;
				$scope.articuGiveMainTitle = false;
				$scope.articuGiveMindsetTitle = false;
				$scope.articuGiveQuestions = false;
				$scope.articuGiveTQuestions = false;
				$scope.articuGivePQuestions = false;
				$scope.articuGiveMindsetQuestions = false;
				$scope.showArticuGiveMindsetStep1 = false;
				$scope.showArticuGiveMindsetStep2 = false;
				$scope.showArticuGiveMindsetStep3 = false;
				$scope.showArticuGiveMindsetStep4 = false;
		
		$scope.showFunc = false;
		$scope.functionQuestions = false;
		$scope.showFuncStep1 = false; //to 4
		$scope.showFuncStep2 = false;
		$scope.showFuncStep3 = false;
		$scope.showFuncStep4 = false;

				$scope.funcBalancedQuestions = false; 
				$scope.funcBalMindsetQuestions = false;
				$scope.showFuncBalMindsetStep1 = false;
				$scope.showFuncBalMindsetStep2 = false;
				$scope.showFuncBalMindsetStep3 = false;
				$scope.showFuncBalMindsetStep4 = false;

				$scope.funcGivingQuestions = false; 
				$scope.funcGiveMainTitle = false;
				$scope.funcGiveMindsetTitle = false;
				$scope.funcGiveQuestions = false;
				$scope.funcGiveTQuestions = false;
				$scope.funcGivePQuestions = false;
				$scope.funcGiveMindsetQuestions = false;
				$scope.showFuncGiveMindsetStep1 = false;
				$scope.showFuncGiveMindsetStep2 = false;
				$scope.showFuncGiveMindsetStep3 = false;
				$scope.showFuncGiveMindsetStep4 = false;

		//questions want to be refreshed upon restart, so calling the json again and populating the view again also
		$http({
			method: 'GET',
			url: 'assets/resource/data/uk/molton-brown.json'
		}).then(function (res) {
	
			let preference = res.data[0].preference;
			let attraction = res.data[0].preference[0].character[0].attraction;
			let articulation = res.data[0].preference[0].character[0].articulation;
			let functionChar = res.data[0].preference[0].character[0].function;
			
			
			$scope.preference = preference;
				$scope.prefQOne = shuffleQuestion(preference[0].questions[0].question_one);
				$scope.prefQTwo = shuffleQuestion(preference[0].questions[0].question_two);
				$scope.prefQThree = shuffleQuestion(preference[0].questions[0].question_three);
				$scope.prefQFour = shuffleQuestion(preference[0].questions[0].question_four);
				
			$scope.attraction = attraction;
				$scope.attrQOne = shuffleQuestion(attraction[0].questions[0].question_one);
				$scope.attrQTwo = shuffleQuestion(attraction[0].questions[0].question_two);
				$scope.attrQThree = shuffleQuestion(attraction[0].questions[0].question_three);
				$scope.attrQFour = shuffleQuestion(attraction[0].questions[0].question_four);
	
				$scope.attrIndQ = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_select);
				$scope.attrIndQEdt = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edt);
				$scope.attrIndQEdp = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].fragrance_final[0].edp);
	
				$scope.attrIndMindQOne = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
				$scope.attrIndMindQTwo = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
				$scope.attrIndMindQThree = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
				$scope.attrIndMindQFour = shuffleQuestion(attraction[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);
	
				$scope.attrBalMindQOne = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
				$scope.attrBalMindQTwo = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
				$scope.attrBalMindQThree = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
				$scope.attrBalMindQFour = shuffleQuestion(attraction[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
	
				$scope.attrGiveQ = shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_select);
				$scope.attrGiveQEdt = shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edt);
				$scope.attrGiveQEdp = shuffleQuestion(attraction[0].selection.giving[0].questions[0].fragrance_final[0].edp);
	
				$scope.attrGiveMindQOne = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
				$scope.attrGiveMindQTwo = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
				$scope.attrGiveMindQThree = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
				$scope.attrGiveMindQFour = shuffleQuestion(attraction[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
	
			
			$scope.articulation = articulation;
				$scope.articuQOne = shuffleQuestion(articulation[0].questions[0].question_one);
				$scope.articuQTwo = shuffleQuestion(articulation[0].questions[0].question_two);
				$scope.articuQThree = shuffleQuestion(articulation[0].questions[0].question_three);
				$scope.articuQFour = shuffleQuestion(articulation[0].questions[0].question_four);
	
				$scope.articuIndQ = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].fragrance_select);
	
				$scope.articuIndMindQOne = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_one);
				$scope.articuIndMindQTwo = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_two);
				$scope.articuIndMindQThree = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_three);
				$scope.articuIndMindQFour = shuffleQuestion(articulation[0].selection.indulgent[0].questions[0].mindset[0].questions[0].question_four);
	
				$scope.articuBalQ = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_select);
				$scope.articuBalQEdt = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edt);
				$scope.articuBalQEdp = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].fragrance_final[0].edp);
	
				$scope.articuBalMindQOne = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
				$scope.articuBalMindQTwo = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
				$scope.articuBalMindQThree = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
				$scope.articuBalMindQFour = shuffleQuestion(articulation[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
	
				$scope.articuGiveQ = shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_select);
				$scope.articuGiveQEdt = shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edt);
				$scope.articuGiveQEdp = shuffleQuestion(articulation[0].selection.giving[0].questions[0].fragrance_final[0].edp);
	
				$scope.articuGiveMindQOne = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
				$scope.articuGiveMindQTwo = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
				$scope.articuGiveMindQThree = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
				$scope.articuGiveMindQFour = shuffleQuestion(articulation[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
	
			$scope.function = functionChar;
				$scope.funcQOne = shuffleQuestion(functionChar[0].questions[0].question_one);
				$scope.funcQTwo = shuffleQuestion(functionChar[0].questions[0].question_two);
				$scope.funcQThree = shuffleQuestion(functionChar[0].questions[0].question_three);
				$scope.funcQFour = shuffleQuestion(functionChar[0].questions[0].question_four);
	
				$scope.funcBalMindQOne = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_one);
				$scope.funcBalMindQTwo = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_two);
				$scope.funcBalMindQThree = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_three);
				$scope.funcBalMindQFour = shuffleQuestion(functionChar[0].selection.balanced[0].questions[0].mindset[0].questions[0].question_four);
	
				$scope.funcGiveQ = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_select);
				$scope.funcGiveQEdt = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edt);
				$scope.funcGiveQEdp = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].fragrance_final[0].edp);
	
				$scope.funcGiveMindQOne = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_one);
				$scope.funcGiveMindQTwo = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_two);
				$scope.funcGiveMindQThree = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_three);
				$scope.funcGiveMindQFour = shuffleQuestion(functionChar[0].selection.giving[0].questions[0].mindset[0].questions[0].question_four);
	
			
	
		},function(err) {
			console.log(err)
		});
	}

	/*this takes the user to the next step, depending on its parameters from the view
	the num is the step, 
	list is the user selected, 
	type is the category, 
	parent is what the current branch and
	pick is for tracking purposes for the main branch questions
	*/

	$scope.nextStep = function(num, list, type, parent, pick) {
		switch(type) {
			case "preference":
				switch(num) {
				case 1:
					$scope.startStep1 = false;
					$scope.startStep2 = true;

					prefArray.push(list.selected);

					gtag('event', 'Stage 1', {
						'event_category': 'Answer 1',
						'event_label': pick
					});
				break;
				case 2:
					$scope.startStep2 = false;
					$scope.startStep3 = true;

					prefArray.push(list.selected);

					gtag('event', 'Stage 1', {
						'event_category': 'Answer 2',
						'event_label': pick
					});
				break;
				case 3:
					$scope.startStep3 = false;

					prefArray.push(list.selected);
				compareArray(prefArray, type,null);

					gtag('event', 'Stage 1', {
						'event_category': 'Answer 3',
						'event_label': pick
					});
				break;
				case 4:
					$scope.startStep4 = false;
					prefArray.push(list.selected);
					compareArray(prefArray, type,null);

					gtag('event', 'Stage 1', {
						'event_category': 'Answer 4',
						'event_label': pick
					});
				break;
				}
			break;
			case "attraction":
				switch(num) {
					case 1:
						$scope.showAttractStep1 = false;
						$scope.showAttractStep2 = true;
						
						charactarArray.push(list.selected);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 1',
							'event_label': pick
						});

					break;
					case 2:
						$scope.showAttractStep2 = false;
						$scope.showAttractStep3 = true;
						
						charactarArray.push(list.selected);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 2',
							'event_label': pick
						});
						
					break;
					case 3:
						$scope.showAttractStep3 = false;
						
						charactarArray.push(list.selected)
						compareArray(charactarArray, type,null);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 3',
							'event_label': pick
						});
					
					break;
					case 4:
						$scope.showAttractStep4 = false;

						charactarArray.push(list.selected)
						compareArray(charactarArray, type,null);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 4',
							'event_label': pick
						});
					break;
				}
			break;
			case "articulation":
				switch(num) {
					case 1:
						$scope.showArticuStep1 = false;
						$scope.showArticuStep2 = true;
						
						charactarArray.push(list.selected);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 1',
							'event_label': pick
						});
					break;
					case 2:
						$scope.showArticuStep2 = false;
						$scope.showArticuStep3 = true;
						
						charactarArray.push(list.selected);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 2',
							'event_label': pick
						});
						
					break;
					case 3:
						$scope.showArticuStep3 = false;
						
						charactarArray.push(list.selected)
						compareArray(charactarArray, type,null);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 3',
							'event_label': pick
						});
					
					break;
					case 4:
						$scope.showArticuStep4 = false;

						charactarArray.push(list.selected)
						compareArray(charactarArray, type,null);

						gtag('event', 'Stage 2', {
							'event_category': 'Answer 4',
							'event_label': pick
						});

					break;
				}
			break;
			case "function":
			switch(num) {
				case 1:
					$scope.showFuncStep1 = false;
					$scope.showFuncStep2 = true;
					
					charactarArray.push(list.selected);

					gtag('event', 'Stage 2', {
						'event_category': 'Answer 1',
						'event_label': pick
					});

				break;
				case 2:
					$scope.showFuncStep2 = false;
					$scope.showFuncStep3 = true;
					
					charactarArray.push(list.selected);

					gtag('event', 'Stage 2', {
						'event_category': 'Answer 2',
						'event_label': pick
					});
					
				break;
				case 3:
					$scope.showFuncStep3 = false;
					
					charactarArray.push(list.selected);
					compareArray(charactarArray, type,null);

					gtag('event', 'Stage 2', {
						'event_category': 'Answer 3',
						'event_label': pick
					});
				
				break;
				case 4:
					$scope.showFuncStep4 = false;

					charactarArray.push(list.selected);
					compareArray(charactarArray, type,null);

					gtag('event', 'Stage 2', {
						'event_category': 'Answer 4',
						'event_label': pick
					});
				break;
			}
			break;
			case "indulgent":
				switch(parent) {
					case "attractIndulgent":
						switch(num) {
							case 6:
								$scope.indQuestions = false;
								if(list.selected === "T") {
									$scope.indTQuestions = true;

									mindsetTQuestions = true;
									mindsetPQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'T'
									});

								} else {
									$scope.indPQuestions = true;

									mindsetPQuestions = true;
									mindsetTQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'P'
									});
								}
							break;
							case 9:
								$scope.indMainTitle = false;
								$scope.indMindsetTitle = true;
								
								$scope.indTQuestions = false;
								$scope.indPQuestions = false;
								
								$scope.indMindsetQuestions = true;
								$scope.showIndMindsetStep1 = true;
								
								$scope.activeStage4 = true;

								sampleArray.push(list.selected);

								gtag('event', 'Stage 4', {
									'event_category': 'Answer 2',
									'event_label': pick
								});

							break;
						}
					break;
					case "artIndulgent":
						switch(num) {
							case 6:
								if(list.selected === "T") {
									sampleArray.push('T213');
									$scope.articuIndQuestions = false;
									$scope.articuIndMindsetQuestions = true;
									$scope.showArticuIndMindsetStep1 = true;

									$scope.articuIndMainTitle = false;
									$scope.articuIndMindsetTitle = true;

									$scope.activeStage4 = true;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'T213'
									});

								} else {
									sampleArray.push('P213');
									$scope.articuIndQuestions = false;
									$scope.articuIndMindsetQuestions = true;
									$scope.showArticuIndMindsetStep1 = true;

									$scope.articuIndMainTitle = false;
									$scope.articuIndMindsetTitle = true;

									$scope.activeStage4 = true;

									gtag('event', 'Stage 4', {
										'event_category': 'Answer 1',
										'event_label': 'P213'
									});
								}
							break;
						}
					break;
				}
			break;
			case "balanced":
				switch(parent) {
					case "artBalanced":
						switch(num) {
							case 6:
								$scope.articuBalQuestions = false;
								if(list.selected === "T") {
									$scope.articuBalTQuestions = true;

									mindsetTQuestions = true;
									mindsetPQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'T'
									});

								} else {
									$scope.articuBalPQuestions = true;

									mindsetPQuestions = true;
									mindsetTQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'P'
									});
								}
							break;
							case 9:
								$scope.articuBalMainTitle = false;
								$scope.articuBalMindsetTitle = true;
								
								$scope.articuBalTQuestions = false;
								$scope.articuBalPQuestions = false;
								
								$scope.articuBalMindsetQuestions = true;
								$scope.showArticuBalMindsetStep1 = true;
								
								sampleArray.push(list.selected);

								$scope.activeStage4 = true;

								gtag('event', 'Stage 4', {
									'event_category': 'Answer 2',
									'event_label': pick
								});

							break;
						}
					break;
				}
			break;
			case "giving":
				switch(parent) {
					case "attractGiving":
						switch(num) {
							case 6:
								$scope.giveQuestions = false;
								if(list.selected === "T") {
									$scope.giveTQuestions = true;

									mindsetTQuestions = true;
									mindsetPQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'T'
									});

								} else {
									$scope.givePQuestions = true;

									mindsetPQuestions = true;
									mindsetTQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'P'
									});
								}
							break;
							case 9:
								$scope.giveMainTitle = false;
								$scope.giveMindsetTitle = true;
								
								$scope.giveTQuestions = false;
								$scope.givePQuestions = false;
								
								$scope.giveMindsetQuestions = true;
								$scope.showGiveMindsetStep1 = true;
								
								sampleArray.push(list.selected);

								$scope.activeStage4 = true;

								gtag('event', 'Stage 4', {
									'event_category': 'Answer 2',
									'event_label': pick
								});
							break;
						}
					break;
					case "artGiving":
						switch(num) {
							case 6:
								$scope.articuGiveQuestions = false;
								if(list.selected === "T") {
									$scope.articuGiveTQuestions = true;

									mindsetTQuestions = true;
									mindsetPQuestions = false;

									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'T'
									});

								} else {
									$scope.articuGivePQuestions = true;

									mindsetPQuestions = true;
									mindsetTQuestions = false;
									
									gtag('event', 'Stage 3', {
										'event_category': 'Answer 1',
										'event_label': 'P'
									});

								}
							break;
							case 9:
								$scope.articuGiveMainTitle = false;
								$scope.articuGiveMindsetTitle = true;
								
								$scope.articuGiveTQuestions = false;
								$scope.articuGivePQuestions = false;
								
								$scope.articuGiveMindsetQuestions = true;
								$scope.showArticuGiveMindsetStep1 = true;
								
								sampleArray.push(list.selected);

								$scope.activeStage4 = true;

								gtag('event', 'Stage 4', {
									'event_category': 'Answer 2',
									'event_label': pick
								});
							break;
						}
					break;
					case "funcGiving":
					switch(num) {
						case 6:
							$scope.funcGiveQuestions = false;
							if(list.selected === "T") {
								$scope.funcGiveTQuestions = true;

								mindsetTQuestions = true;
								mindsetPQuestions = false;

								gtag('event', 'Stage 3', {
									'event_category': 'Answer 2',
									'event_label': 'T'
								});
							} else {
								$scope.funcGivePQuestions = true;

								mindsetPQuestions = true;
								mindsetTQuestions = false;

								gtag('event', 'Stage 3', {
									'event_category': 'Answer 2',
									'event_label': 'P'
								});

								if( $scope.funcGiveQEdp.length == 1) {
									$scope.funcGiveMainTitle = false;
									$scope.funcGiveMindsetTitle = true;
									
									$scope.funcGiveTQuestions = false;
									$scope.funcGivePQuestions = false;
									
									$scope.funcGiveMindsetQuestions = true;
									$scope.showFuncGiveMindsetStep1 = true;
									
									sampleArray.push('P304');

									$scope.activeStage4 = true;

									gtag('event', 'Stage 4', {
										'event_category': 'Answer 2',
										'event_label': 'P304'
									});
								}
							}
						break;
						case 9:
							$scope.funcGiveMainTitle = false;
							$scope.funcGiveMindsetTitle = true;
							
							$scope.funcGiveTQuestions = false;
							$scope.funcGivePQuestions = false;
							
							$scope.funcGiveMindsetQuestions = true;
							$scope.showFuncGiveMindsetStep1 = true;
							
							sampleArray.push(list.selected);

							$scope.activeStage4 = true;

							gtag('event', 'Stage 4', {
								'event_category': 'Answer 2',
								'event_label': pick
							});
						break;
					}
					break;
				}
			break;
			case "mindset":
				switch(parent) {
					case "attractIndulgent":
						switch(num) {
							case 10:
							
								//store the analytic.express.social
								$scope.showIndMindsetStep1 = false;
								$scope.showIndMindsetStep2 = true;

								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 1',
									'event_label': pick
								});
								
							break;
							case 11:
								//console.log('next step etc');
								$scope.showIndMindsetStep2 = false;
								$scope.showIndMindsetStep3 = true;

								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 2',
									'event_label': pick
								});

							break;
							case 12:
								
								$scope.showIndMindsetStep3 = false;

								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 3',
									'event_label': pick
								});
							break;
							case 13:
								
								$scope.showIndMindsetStep4 = false;
								mindsetArray.push(list.selected);
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 4',
									'event_label': pick
								});
							break;
						}
					break;
					case "attractBalanced":
						switch(num) { 
							case 10:
								//if parent is attraction etc then do this etc
								//store the analytic.express.social
								$scope.showBalMindsetStep1 = false;
								$scope.showBalMindsetStep2 = true;
				
								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 1',
									'event_label': pick
								});
								
							break;
							case 11:
								
								$scope.showBalMindsetStep2 = false;
								$scope.showBalMindsetStep3 = true;
				
								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 2',
									'event_label': pick
								});
				
							break;
							case 12:
								
								$scope.showBalMindsetStep3 = false;
				
								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 3',
									'event_label': pick
								});
							break;
							case 13:
								
								$scope.showBalMindsetStep4 = false;
								mindsetArray.push(list.selected);
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 4',
									'event_label': pick
								});
							break;
							}
					break;
					case "attractGiving":
						switch(num) {
							case 10:
							
								//store the analytic.express.social
								$scope.showGiveMindsetStep1 = false;
								$scope.showGiveMindsetStep2 = true;

								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 1',
									'event_label': pick
								});
								
							break;
							case 11:
							
								$scope.showGiveMindsetStep2 = false;
								$scope.showGiveMindsetStep3 = true;

								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 2',
									'event_label': pick
								});

							break;
							case 12:
								
								$scope.showGiveMindsetStep3 = false;

								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 3',
									'event_label': pick
								});
							break;
							case 13:
								
								$scope.showGiveMindsetStep4 = false;

								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 4',
									'event_label': pick
								});
							break;
						}
					break;
					case "artIndulgent":
						switch(num) {
							case 10:
							
								//store the analytic.express.social
								$scope.showArticuIndMindsetStep1 = false;
								$scope.showArticuIndMindsetStep2 = true;

								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 1',
									'event_label': pick
								});
								
							break;
							case 11:
								
								$scope.showArticuIndMindsetStep2 = false;
								$scope.showArticuIndMindsetStep3 = true;

								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 2',
									'event_label': pick
								});

							break;
							case 12:
								
								$scope.showArticuIndMindsetStep3 = false;

								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 3',
									'event_label': pick
								});
							break;
							case 13:
								
								$scope.showArticuIndMindsetStep4 = false;

								mindsetArray.push(list.selected);

								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 4',
									'event_label': pick
								});
							break;
						}
					break;
					case "artBalanced":
					switch(num) { 
						case 10:
							//if parent is attraction etc then do this etc
							//store the analytic.express.social
							$scope.showArticuBalMindsetStep1 = false;
							$scope.showArticuBalMindsetStep2 = true;
			
							mindsetArray.push(list.selected);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 1',
								'event_label': pick
							});
							
						break;
						case 11:
							
							$scope.showArticuBalMindsetStep2 = false;
							$scope.showArticuBalMindsetStep3 = true;
			
							mindsetArray.push(list.selected);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 2',
								'event_label': pick
							});
			
						break;
						case 12:
							
							$scope.showArticuBalMindsetStep3 = false;
			
							mindsetArray.push(list.selected);
							
							compareArray(mindsetArray, type, parent);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 3',
								'event_label': pick
							});
						break;
						case 13:
							
							$scope.showArticuBalMindsetStep4 = false;
							mindsetArray.push(list.selected);
							compareArray(mindsetArray, type, parent);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 4',
								'event_label': pick
							});
						break;
						}
					break;
					case "artGiving":
					switch(num) {
						case 10:
						
							//store the analytic.express.social
							$scope.showArticuGiveMindsetStep1 = false;
							$scope.showArticuGiveMindsetStep2 = true;

							mindsetArray.push(list.selected);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 1',
								'event_label': pick
							});
							
						break;
						case 11:
						
							$scope.showArticuGiveMindsetStep2 = false;
							$scope.showArticuGiveMindsetStep3 = true;

							mindsetArray.push(list.selected);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 2',
								'event_label': pick
							});

						break;
						case 12:
							
							$scope.showArticuGiveMindsetStep3 = false;

							mindsetArray.push(list.selected);
							
							compareArray(mindsetArray, type, parent);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 3',
								'event_label': pick
							});
						break;
						case 13:
							mindsetArray.push(list.selected);
							$scope.showArticuGiveMindsetStep4 = false;
							compareArray(mindsetArray, type, parent);

							gtag('event', 'Stage 5', {
								'event_category': 'Answer 4',
								'event_label': pick
							});
						break;
					}
					break;
					case "funcBalanced":
						switch(num) { 
							case 10:
								//if parent is attraction etc then do this etc
								//store the analytic.express.social
								$scope.showFuncBalMindsetStep1 = false;
								$scope.showFuncBalMindsetStep2 = true;
				
								mindsetArray.push(list.selected);
								

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 1',
									'event_label': pick
								});
							break;
							case 11:
							
								$scope.showFuncBalMindsetStep2 = false;
								$scope.showFuncBalMindsetStep3 = true;
				
								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 2',
									'event_label': pick
								});
				
							break;
							case 12:
								
								$scope.showFuncBalMindsetStep3 = false;
				
								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 3',
									'event_label': pick
								});
							break;
							case 13:
								
								$scope.showFuncBalMindsetStep4 = false;
								mindsetArray.push(list.selected);
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 4',
									'event_label': pick
								});
							break;
						}
					break;
					case "funcGiving":
						switch(num) { 
							case 10:
								//if parent is attraction etc then do this etc
								//store the analytic.express.social
								$scope.showFuncGiveMindsetStep1 = false;
								$scope.showFuncGiveMindsetStep2 = true;
				
								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 1',
									'event_label': pick
								});
								
							break;
							case 11:
								
								$scope.showFuncGiveMindsetStep2 = false;
								$scope.showFuncGiveMindsetStep3 = true;
				
								mindsetArray.push(list.selected);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 2',
									'event_label': pick
								});
				
							break;
							case 12:
								
								$scope.showFuncGiveMindsetStep3 = false;
				
								mindsetArray.push(list.selected);
								
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 3',
									'event_label': pick
								});
							break;
							case 13:
								
								$scope.showFuncGiveMindsetStep4 = false;
								mindsetArray.push(list.selected);
								compareArray(mindsetArray, type, parent);

								gtag('event', 'Stage 5', {
									'event_category': 'Answer 4',
									'event_label': pick
								});
							break;
						}
					break;
				}
			break;
		}
	}
	
	$scope.prevStep = function(num, list, type, parent) { 

		switch(type) {
			case "preference":
				switch(num) {
				case 1:
				
				$scope.welcomeStep = true;

				$scope.beginStep = true;

				$scope.showSteps = false;
				$scope.showPref = false;
				
				$scope.startStage1 = false;
				$scope.getBGImg.activeQuiz = false;
				$scope.getBGImg.initialProfile = false;

				prefArray = [];
			
				break;
				case 2:
					$scope.startStep2 = false;
					$scope.startStep1 = true;

					prefArray.pop();
				
				break;
				case 3:
					$scope.startStep2 = true;
					$scope.startStep3 = false;

					prefArray.pop();
				
				break;
				case 4:
					$scope.startStep3 = true;
					$scope.startStep4 = false;
					prefArray.pop();
				break;
				}
			break;
			case "attraction":
				switch(num) {
					case 1:

						$scope.showPref = true;

						if(prefQuestionFour) {
								$scope.startStep4 = true;
						} else {
								$scope.startStep3 = true;
						}

					$scope.activeStage2 = false;

						$scope.showAttract = false;
						$scope.attractionQuestions = false;
						$scope.showAttractStep1 = false;

						prefArray.pop();
						charactarArray.pop();

						prefQuestionFour = false;
					break;
					case 2:
						
						$scope.showAttractStep2 = false;
						$scope.showAttractStep1 = true;
						
						charactarArray.pop();
					break;
					case 3:
					
						$scope.showAttractStep3 = false;
						$scope.showAttractStep2 = true;

						charactarArray.pop();
					break;
					case 4:
					
						$scope.showAttractStep4 = false;
						$scope.showAttractStep3 = true;

						charactarArray.pop();
					
					break;
				}
			break;
			case "articulation":
				switch(num) {
					case 1:

					$scope.activeStage2 = false;

						$scope.showPref = true;
						$scope.startStep3 = true;
						$scope.showArticu = false;
						$scope.articulationQuestions = false;
						$scope.showArticuStep1 = false;
						
						prefArray.pop();
						charactarArray.pop();
					break;
					case 2:

						$scope.showArticuStep2 = false;
						$scope.showArticuStep1 = true;
						
						charactarArray.pop();
						
					break;
					case 3:
						$scope.showArticuStep3 = false;
						$scope.showArticuStep2 = true;
						
						charactarArray.pop();
					
					break;
					case 4:
						$scope.showArticuStep4 = false;
						$scope.showArticuStep3 = true;
						charactarArray.pop();
					break;
				}
			break;
			case "function":
			switch(num) {
				case 1:

				$scope.activeStage2 = false;

					$scope.showPref = true;

					$scope.startStep3 = true;

					$scope.showFunc = false;
					$scope.functionQuestions = false;
					$scope.showFuncStep1 = false;
					
					prefArray.pop();
					charactarArray.pop();
				break;
				case 2:
					$scope.showFuncStep2 = false;
					$scope.showFuncStep1 = true;
					
					charactarArray.pop();
					
				break;
				case 3:
					$scope.showFuncStep3 = false;
					$scope.showFuncStep2 = true;

					charactarArray.pop();
				
				break;
				case 4:
					$scope.showFuncStep4 = false;
					$scope.showFuncStep3 = true;

					charactarArray.pop();
				break;
			}
			break;
			case "indulgent":
				switch(parent) {
					case "attractIndulgent":
						switch(num) {
							case 6:

								if(charQuestionFour) {
									$scope.showAttractStep4 = true;
								} else {
									$scope.showAttractStep3 = true;
								}

								$scope.attractionQuestions = true;

								$scope.attractIndulgentQuestions = false;
								$scope.indQuestions = false;
								$scope.indMainTitle = false;
								charQuestionFour = false;
								charactarArray.pop();

								$scope.activeStage3 = false;
							break;
							case 9:
								$scope.indMainTitle = true;
								$scope.indMindsetTitle = false;
								
								$scope.indQuestions = true;
								
								$scope.indTQuestions = false;
								$scope.indPQuestions = false;
								
								$scope.indMindsetQuestions = false;
								$scope.showIndMindsetStep1 = false;
							
							break;
						}
					break;
					case "artIndulgent":
						switch(num) {
							case 6:
								if(charQuestionFour) {
									$scope.showArticuStep4 = true;
								} else {
									$scope.showArticuStep3 = true;
								}

								$scope.articulationQuestions = true;

								$scope.articuIndulgentQuestions = false;

								$scope.articuIndMainTitle = false;
								$scope.articuIndQuestions = false;

								charQuestionFour = false;

								charactarArray.pop();

								$scope.activeStage3 = false;
							break;
						}
					break;
				}
			break;
			case "balanced":
				switch(parent) {
					case "artBalanced":
						switch(num) {
							case 6:

								if(charQuestionFour) {
									$scope.showArticuStep4 = true;
								} else {
									$scope.showArticuStep3 = true;
								}

								$scope.articulationQuestions = true;

								$scope.articuBalancedQuestions = false;
								$scope.articuBalQuestions = false;
								$scope.articuBalMainTitle = false;
								charQuestionFour = false;
								charactarArray.pop();

								$scope.activeStage3 = false;

							break;
							case 9:
								$scope.articuBalMainTitle = true;
								$scope.articuBalMindsetTitle = false;
								
								$scope.articuBalQuestions = true;

								$scope.articuBalTQuestions = false;
								$scope.articuBalPQuestions = false;
								
								$scope.articuBalMindsetQuestions = false;
								$scope.showArticuBalMindsetStep1 = false;

							break;
						}
					break;
				}
			break;
			case "giving":
				switch(parent) {
					case "attractGiving":
						switch(num) {
							case 6:

								if(charQuestionFour) {
									$scope.showAttractStep4 = true;
								} else {
									$scope.showAttractStep3 = true;
								}

								$scope.attractionQuestions = true;

								$scope.attractGivingQuestions = false;
								$scope.giveQuestions = false;
								$scope.giveMainTitle = false;
								charQuestionFour = false;
								charactarArray.pop();

								$scope.activeStage3 = false;

							break;
							case 9:
								$scope.giveMainTitle = true;
								$scope.giveMindsetTitle = false;
								
								$scope.giveQuestions = true;

								$scope.giveTQuestions = false;
								$scope.givePQuestions = false;
								
								$scope.giveMindsetQuestions = false;
								$scope.showGiveMindsetStep1 = false;

							break;
						}
					break;
					case "artGiving":
						switch(num) {
							case 6:

								if(charQuestionFour) {
									$scope.showArticuStep4 = true;
								} else {
									$scope.showArticuStep3 = true;
								}

								$scope.articulationQuestions = true;

								$scope.articuGivingQuestions = false;

								$scope.articuGiveQuestions = false;
								$scope.articuGiveMainTitle = false;

								charQuestionFour = false;
								charactarArray.pop();

								$scope.activeStage3 = false;
							break;
							case 9:
								$scope.articuGiveMainTitle = true;
								$scope.articuGiveMindsetTitle = false;
								
								$scope.articuGiveQuestions = true;

								$scope.articuGiveTQuestions = false;
								$scope.articuGivePQuestions = false;
								
								$scope.articuGiveMindsetQuestions = false;
								$scope.showArticuGiveMindsetStep1 = false;
							break;
						}
					break;
					case "funcGiving":
					switch(num) {
						case 6:
							if(charQuestionFour) {
								$scope.showFuncStep4 = true;
							} else {
								$scope.showFuncStep3 = true;
							}

							$scope.functionQuestions = true;

							$scope.funcGivingQuestions = false;

							$scope.funcGiveQuestions = false;
							$scope.funcGiveMainTitle = false;

							charQuestionFour = false;
							charactarArray.pop();

							$scope.activeStage3 = false;
						break;
						case 9:
							$scope.funcGiveMainTitle = true;
							$scope.funcGiveMindsetTitle = false;
							
							$scope.funcGiveQuestions = true;

							$scope.funcGiveTQuestions = false;
							$scope.funcGivePQuestions = false;
							
							$scope.funcGiveMindsetQuestions = false;
							$scope.showFuncGiveMindsetStep1 = false;
						break;
					}
					break;
				}
			break;
			case "mindset":
				switch(parent) {
					case "attractIndulgent":
						switch(num) {
							case 10:
							
								$scope.indMainTitle = true;
								$scope.indMindsetTitle = false;
	
								$scope.indMindsetQuestions = false;
								$scope.showIndMindsetStep1 = false;

								if(mindsetTQuestions) {
									$scope.indTQuestions = true;
								} else {
									$scope.indPQuestions = true;
								}
								
								sampleArray.pop();

								$scope.activeStage4 = false;

							break;
							case 11:
								$scope.showIndMindsetStep2 = false;
								$scope.showIndMindsetStep1 = true;

								mindsetArray.pop();

							break;
							case 12:
								
								$scope.showIndMindsetStep3 = false;
								$scope.showIndMindsetStep2 = true;

								mindsetArray.pop();
								
								
							break;
							case 13:
								
								$scope.showIndMindsetStep4 = false;
								$scope.showIndMindsetStep3 = true;
								mindsetArray.pop();
							break;
						}
					break;
					case "attractBalanced":
						switch(num) { 
							case 10:

								if(charQuestionFour) {
									$scope.showAttractStep4 = true;
								} else {
									$scope.showAttractStep3 = true;
								}

								$scope.attractionQuestions = true;
								$scope.attractBalancedQuestions = false;
								$scope.balMindsetQuestions = false;
								$scope.showBalMindsetStep1 = false;

								charQuestionFour = false;
								
								sampleArray.pop();

								$scope.activeStage4 = false;
							break;
							case 11:
							
								$scope.showBalMindsetStep2 = false;
								$scope.showBalMindsetStep1 = true;
				
								mindsetArray.pop();
				
							break;
							case 12:
								
								$scope.showBalMindsetStep3 = false;
								$scope.showBalMindsetStep2 = true;

								mindsetArray.pop();
								
							break;
							case 13:
								
								$scope.showBalMindsetStep4 = false;
								$scope.showBalMindsetStep3 = true;

								mindsetArray.pop();
							}
					break;
					case "attractGiving":
						switch(num) {
							case 10:
							
							$scope.giveMainTitle = true;
							$scope.giveMindsetTitle = false;
 
							$scope.giveMindsetQuestions = false;
							$scope.showGiveMindsetStep1 = false;

							if(mindsetTQuestions) {
								$scope.giveTQuestions = true;
							} else {
								$scope.givePQuestions = true;
							}
							
							sampleArray.pop();

							$scope.activeStage4 = false;
								
							break;
							case 11:
								
								$scope.showGiveMindsetStep2 = false;
								$scope.showGiveMindsetStep1 = true;

								mindsetArray.pop();

							break;
							case 12:
								
								$scope.showGiveMindsetStep3 = false;
								$scope.showGiveMindsetStep2 = true;

								mindsetArray.pop();
								
							break;
							case 13:
								
								$scope.showGiveMindsetStep4 = false;
								$scope.showGiveMindsetStep3 = true;

								mindsetArray.pop();
							break;
						}
					break;
					case "artIndulgent":
						switch(num) {
							case 10:

								$scope.articuIndQuestions = true;
								$scope.articuIndMindsetQuestions = false;
								$scope.showArticuIndMindsetStep1 = false;

								$scope.articuIndMainTitle = true;
								$scope.articuIndMindsetTitle = false;

								sampleArray.pop();

								$scope.activeStage4 = false;
								
							break;
							case 11:
								
								$scope.showArticuIndMindsetStep2 = false;
								$scope.showArticuIndMindsetStep1 = true;

								mindsetArray.pop();

							break;
							case 12:
								
								$scope.showArticuIndMindsetStep3 = false;
								$scope.showArticuIndMindsetStep2 = true;

								mindsetArray.pop();
							break;
							case 13:
								
								$scope.showArticuIndMindsetStep4 = false;
								$scope.showArticuIndMindsetStep3 = true;

								mindsetArray.pop();
							break;
						}
					break;
					case "artBalanced":
					switch(num) { 
						case 10:
							
							$scope.articuBalMainTitle = true;
							$scope.articuBalMindsetTitle = false;
	
							$scope.articuBalMindsetQuestions = false;
							$scope.showArticuBalMindsetStep1 = false;

							if(mindsetTQuestions) {
								$scope.articuBalTQuestions = true;
							} else {
								$scope.articuBalPQuestions = true;
							}
							
							sampleArray.pop();

							$scope.activeStage4 = false;

						break;
						case 11:
							
							$scope.showArticuBalMindsetStep2 = false;
							$scope.showArticuBalMindsetStep1 = true;
			
							mindsetArray.pop();
			
						break;
						case 12:
							
							$scope.showArticuBalMindsetStep3 = false;
							$scope.showArticuBalMindsetStep2 = true;
			
							mindsetArray.pop();
						break;
						case 13:
							
							$scope.showArticuBalMindsetStep4 = false;
							$scope.showArticuBalMindsetStep3 = true;

							mindsetArray.pop();

						break;
						}
					break;
					case "artGiving":
					switch(num) {
						case 10:

								$scope.articuGiveMainTitle = true;
								$scope.articuGiveMindsetTitle = false;
	
								$scope.articuGiveMindsetQuestions = false;
								$scope.showArticuGiveMindsetStep1 = false;

								if(mindsetTQuestions) {
									$scope.articuGiveTQuestions = true;
								} else {
									$scope.articuGivePQuestions = true;
								}
								
								sampleArray.pop();

								$scope.activeStage4 = false;
							
						break;
						case 11:
						
							$scope.showArticuGiveMindsetStep2 = false;
							$scope.showArticuGiveMindsetStep1 = true;

							mindsetArray.pop();

						break;
						case 12:
							
							$scope.showArticuGiveMindsetStep3 = false;
							$scope.showArticuGiveMindsetStep2 = true;

							mindsetArray.pop();
						break;
						case 13:
							
							$scope.showArticuGiveMindsetStep4 = false;
							$scope.showArticuGiveMindsetStep3 = true;
							
							mindsetArray.pop();
						break;
					}
					break;
					case "funcBalanced":
						switch(num) { 
							case 10:
								
								if(charQuestionFour) {
									$scope.showFuncStep4 = true;
								} else {
									$scope.showFuncStep3 = true;
								}

								$scope.functionQuestions = true;
								$scope.funcBalancedQuestions = false;
								$scope.funcBalMindsetQuestions = false;
								$scope.showFuncBalMindsetStep1 = false;

								charQuestionFour = false;
								
								sampleArray.pop();
								$scope.activeStage4 = false;
								
							break;
							case 11:
								
								$scope.showFuncBalMindsetStep2 = false;
								$scope.showFuncBalMindsetStep1 = true;
				
								mindsetArray.pop();
				
							break;
							case 12:
								
								$scope.showFuncBalMindsetStep3 = false;
								$scope.showFuncBalMindsetStep1 = true;
				
								mindsetArray.pop();

							break;
							case 13:
								
								$scope.showFuncBalMindsetStep4 = false;
								$scope.showFuncBalMindsetStep3 = true;

								mindsetArray.pop();

							break;
						}
					break;
					case "funcGiving":
						switch(num) { 
							case 10:
								
								$scope.funcGiveMainTitle = true;
								$scope.funcGiveMindsetTitle = false;
	
								$scope.funcGiveQuestions = false;
								$scope.showFuncGiveMindsetStep1 = false;

								if(mindsetTQuestions) {
									$scope.funcGiveTQuestions = true;
								} else {
									//$scope.funcGivePQuestions = true;

									if ($scope.funcGiveQEdp.length == 1) {
										$scope.funcGiveQuestions = true;
									} else {
										$scope.funcGivePQuestions = true;
									}
								}
								
								sampleArray.pop();

								$scope.activeStage4 = false;
								
							break;
							case 11:
							
								$scope.showFuncGiveMindsetStep2 = false;
								$scope.showFuncGiveMindsetStep1 = true;
				
								mindsetArray.pop();
				
							break;
							case 12:
								
								$scope.showFuncGiveMindsetStep3 = false;
								$scope.showFuncGiveMindsetStep2 = true;
				
								mindsetArray.pop();

							break;
							case 13:
								
								$scope.showFuncGiveMindsetStep4 = false;
								$scope.showFuncGiveMindsetStep3 = true;

								mindsetArray.pop();
								
							break;
						}
					break;
				}
			break;
		}
	}
	
} ]);
