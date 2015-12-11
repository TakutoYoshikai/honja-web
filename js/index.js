
var english = {
	what_is_honja: "What is HONJA?",
	try_honja: "Try HONJA!",
	enter_hiragana_or_katakana: "Enter Hiragana or Katakana",
	honja_description: "HONJA is not a translator. \nIt is a Transliterator."
}

var japanese = {
	what_is_honja: "HONJAとは？",
	try_honja: "HONJAを試してみてください",
	enter_hiragana_or_katakana: "ひらがなか カタカナを 入力してください",
	honja_description: "HONJAは多言語ひらがな翻字サービスです。\nHONJAはひらがな・カタカナを別言語の似た音表記に変換します。\n「翻字」であり、「翻訳」ではありません。"
}

angular.module("honja", []).controller("HonjaController", 
	function($scope, $http){
		var langs = ["Japanese", "Romaji", "Thai", "Korean", "Arabic", "Hebrew", "Russian", "Georgian", "Armenian", "Greek", "Tibetan", "Hindi", "Sinhalese", "Tamil", "Khmer", "Amharic", "Burmese"];
		var langs_google = {"Japanese":"ja", "Romaji":"en", "Thai":"th", "Korean":"ko", "Arabic":"ar", "Russian":"ru", "Greek":"el", "Hindi":"hi", "Tamil":"ta"};

		var honjaApi = (function(){
			
			var baseUrl = "http://magnetohacks.com:3000";

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

		var userAgent = navigator.userAgent;
		$scope.input = "ひらがなか カタカナを いれてください";
		$scope.results = [];
		$scope.language = japanese;
		$scope.goToGoogleTranslate = function(url){
			if (!url){
				return;
			}

			window.open(url);
		}
		var canUseGoogleTranslate = function(lang){
			if (!langs_google[lang]){
				return false;
			}

			return true;
		}

		var createLinkToGoogleTranslate = function(lang, result){
			if (!canUseGoogleTranslate(lang)) return null;
			if ((userAgent.indexOf('iPhone') > 0 
					&& userAgent.indexOf('iPad') == -1)
					|| userAgent.indexOf('iPod') > 0
					|| userAgent.indexOf('Android') > 0) {
				return "https://translate.google.co.jp/m/translate#" + langs_google[lang] + "/ja/" + result;
			} 
			return "https://translate.google.co.jp/#" + langs_google[lang] + "/ja/" + result;
		}
		var sortLangs = function(arr){
			var result = [];
			langs.forEach(function(lang){
				for (var ii = 0; ii < $scope.results.length; ii++){
					if (lang == $scope.results[ii].language){
						result.push($scope.results[ii]);
						break;
					}
				}
			});

			return result;
		}
		$scope.english = function(){
			$scope.language = english;
		}
		$scope.japanese = function(){
			$scope.language = japanese;
		}
		$scope.openAbout = function(){
			if ($scope.language == japanese){
				window.open("https://sites.google.com/site/nihongolc/honja");
			} else if ($scope.language == english){
				window.open("https://sites.google.com/site/nihongolc/honja/what-s-honja");
			}
		}
		$scope.transliterate = function(){
			honjaApi.sendRequest($scope.input, function(err, res){
				if (err) console.log(err);
				else {
					$scope.results = [];
					angular.forEach(res, function(value, key){
						$scope.results.push({language:key, res:value, url: createLinkToGoogleTranslate(key, value)});
						
					});
					$scope.results = sortLangs($scope.results);
					console.log($scope.results);
				}
			});
		}
	});



