var langs = ["Japanese", "Romaji", "Thai", "Korean", "Arabic", "Hebrew", "Russian", "Georgian", "Armenian", "Greek", "Tibetan", "Hindi", "Sinhalese", "Tamil", "Khmer", "Amharic", "Burmese"];
var langs_gt = {"Japanese":"ja", "Romaji":"en", "Thai":"th", "Korean":"ko", "Arabic":"ar", "Russian":"ru", "Greek":"el", "Hindi":"hi", "Tamil":"ta"};
var userAgent = navigator.userAgent;
var sendRequest = function(target, languageName){
	var url = "http://magnetohacks.com:3000/convert?target=" + target + "&lang=" + languageName;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4 && xhr.status == 200){
			var json = xhr.responseText;
			appendResult(parse(json));
		}
	}
	xhr.send(null);

}
var createLinkToGoogleTranslate = function(lang, target){

	var ele_a = document.createElement("a");

	if ((userAgent.indexOf('iPhone') > 0 && 
		userAgent.indexOf('iPad') == -1) 
		|| userAgent.indexOf('iPod') > 0 
		|| userAgent.indexOf('Android') > 0) {
		ele_a.href = "https://translate.google.co.jp/m/translate#" + lang + "/ja/" + target;
	} else {
	
		ele_a.href = "https://translate.google.co.jp/#" + lang + "/ja/" + target;
	
	}

	ele_a.innerHTML = target;
	ele_a.target = "_blank";
	return ele_a;
	
}
var sendRequest_all = function(target){
	
	var url = "http://magnetohacks.com:3000/all?target=" + target;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4 && xhr.status == 200){
			var json = xhr.responseText;
			var obj = JSON.parse(json);
			
			for (var i = 0; i < langs.length; i++){
				var lang =langs[i];
				appendResult(langs[i], obj[lang]);
			}
		}
	}
	xhr.send(null);
}
var parse = function(json){
	var obj = JSON.parse(json);
	return obj["result"];
}
var appendResult = function(lang, result){
	var ele = document.getElementById("result");
	var langele = document.createElement("td");
	var langstr = document.createTextNode(lang);
	langele.appendChild(langstr);

	var resultele = document.createElement("td");
	var resultstr;
	if (langs_gt[lang] == undefined){
	 	resultstr = document.createTextNode(result);
	} else {
		resultstr = createLinkToGoogleTranslate(langs_gt[lang], result);
	}
	resultele.appendChild(resultstr);
	var trele = document.createElement("tr");
	trele.appendChild(langele);
	trele.appendChild(resultele);
	ele.appendChild(trele);
}

window.onload = function(){
	document.getElementById("enter").onclick = function(){
		document.getElementById("result").innerHTML = "<tr><th>Language</th><th>Result</th></tr>";
		var target = document.getElementById("text").value;
		sendRequest_all(target);
	}
	
	
}

function keydown(keyCode){
	if (keyCode == 13){
		document.getElementById("result").innerHTML = "<tr><th>Language</th><th>Result</th></tr>";
		var target = document.getElementById("text").value;
		sendRequest_all(target);
	}
}
