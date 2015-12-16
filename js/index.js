
var Language = (function(){
	
	return {
		japanese: {
			languageNameList:{
				Japanese: "日本語",
				Romaji: "ローマ字",
				Thai: "タイ語",
				Korean: "ハングル",
				Arabic: "アラビア語",
				Hebrew: "ヘブライ語",
				Russian: "ロシア語",
				Georgian: "ジョージア語",
				Armenian:　"アルメニア語",
				Greek:	"ギリシャ語",
				Tibetan: "チベット語",
				Hindi: "ヒンディー語",
				Sinhalese:"シンハラ語",
				Tamil:"タミル語",
				Khmer:"クメール語",
				Amharic:"アムハラ語",
				Burmese: "ビルマ語"
			},
			localize: {
				what_is_honja: "HONJAとは？",
				try_honja: "HONJAを試してみてください",
				enter_hiragana_or_katakana: "ひらがなか カタカナを 入力してください",
				honja_description: "HONJAは多言語ひらがな翻字サービスです。\nHONJAはひらがな・カタカナを別言語の似た音表記に変換します。\n「翻字」であり、「翻訳」ではありません。"
			}
		},
		english: {
			languageNameList: {
				Japanese:"Japanese",
				Romaji:"Romaji",
				Thai:"Thai",
				Korean:"Korean",
				Arabic: "Arabic",
				Hebrew: "Hebrew",
				Russian: "Russian",
				Georgian: "Georgian",
				Armenian: "Armenian",
				Greek: "Greek",
				Tibetan: "Tibetan",
				Hindi: "Hindi",
				Sinhalese: "Sinhalese",
				Tamil: "Tamil",
				Khmer: "Khmer",
				Amharic: "Amharic",
				Burmese: "Burmese"
			},
			localize: {
				what_is_honja: "What is HONJA?",
				try_honja: "Try HONJA!",
				enter_hiragana_or_katakana: "Enter Hiragana or Katakana",
				honja_description: "HONJA is not a translator. \nIt is a Transliterator."
			}
		}
	}
})();

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
		$scope.language = Language.japanese;
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
			$scope.language = Language.english;
		}
		$scope.japanese = function(){
			$scope.language = Language.japanese;
		}
		$scope.openAbout = function(){
			if ($scope.language == Language.japanese){
				window.open("https://sites.google.com/site/nihongolc/honja");
			} else if ($scope.language == Language.english){
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
		document.getElementById("honja-input").onkeypress = function(evt){
			if (13 == evt.keyCode){
				$scope.transliterate();
			}
		}
	});



