
var english = {
	what_is_honja: "What is HONJA?",
	try_honja: "Try HONJA!",
	enter_hiragana_or_katakana: "Enter Hiragana or Katakana"
}

var japanese = {
	what_is_honja: "HONJAとは？",
	try_honja: "Honjaを試してみてください",
	enter_hiragana_or_katakana: "ひらがなかカタカナを入力してください"
}

angular.module("honja", []).controller("HonjaController", 
	function($scope, $http){
		var honjaApi = (function(){
			
			var baseUrl = "http://magnetohacks.com:3000";
			var langs = ["Japanese", "Romaji", "Thai", "Korean", "Arabic", "Hebrew", "Russian", "Georgian", "Armenian", "Greek", "Tibetan", "Hindi", "Sinhalese", "Tamil", "Khmer", "Amharic", "Burmese"];

			var sendRequest = function(input, callback){
				var url = baseUrl + "/all?target=" + input;
				$http.get(url)
					.success(function(data, status, headers, config){
						callback(null, data);
					})
					.error(function(err){
						callback(err, null);
					});
			}
			return {
				sendRequest: sendRequest,
			}
		})();
		$scope.input = "";
		$scope.results = [];
		$scope.language = japanese;
		$scope.english = function(){
			$scope.language = english;
		}
		$scope.japanese = function(){
			$scope.language = japanese;
		}
		$scope.transliterate = function(){
			honjaApi.sendRequest($scope.input, function(err, res){
				if (err) console.log(err);
				else {
					$scope.results = [];
					angular.forEach(res, function(value, key){
						$scope.results.push({language:key, res:value});
					});
				}
			});
		}
	});



