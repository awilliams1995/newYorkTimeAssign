
function validate(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,}$/.test(password);
}

$("#searchbtn").on("click", function(event) {
	console.log(new Date());
	event.preventDefault();   
 var term  = $("#searchterm").val();
 var numberOfRecords  = $("#select").val();
 var startYear  = $("#startyear").val();
 var endYear  = $("#endyear").val();
console.log(term.replace(/\s{1,}/, "x"));
console.log(term.replace(/\s{1,}/, "x").length)
if(term.length == 0 || term.replace(/\s+/, "x") == "x"){
	return alert("Please enter a search term");
}
var searchObject = {}
var searchForAnArticle = function (term,startYear,endYear){

searchObject["api-key"] = "e602416e1df44091b3750704a4b7f198";
searchObject.q = term.trim();


if(startYear != "undefined" && typeof parseInt(startYear) == "number"
 && parseInt(startYear)>1000 && parseInt(startYear)<2018){

searchObject.begin_date = Math.floor(startYear) + "0101";

}else if(startYear.length != 0){
	return ;
}
if(endYear != "undefined" && typeof parseInt(endYear) == "number"&& parseInt(endYear)>1000 
	&& parseInt(endYear) < 2018 && parseInt(endYear)>=parseInt(startYear)){

searchObject.end_date = Math.floor(endYear) + "1231";

}else if (endYear.length !=0){
	return ; 
}

return true;

};
var truth = searchForAnArticle(term,startYear,endYear)? true: false; 
if(!truth){return alert("invalid year inputs, please review")}



var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param(searchObject);
$.ajax({
  url: url,
  method: 'GET',
}).done(function(x) {
	result = x.response.docs;
	result = result.sort(function (a, b) {

  return new Date(a.pub_date).getTime() - new Date(b.pub_date).getTime();

});
	if (x.response.meta.hits == 0){
		return alert("Sorry, there aren't any matches with your search term(s)")
	}

	$(".result").show();

	for (var i = 0; i < numberOfRecords; i++) {
		$("#resultsRenderingLocation").append("<h3>"+(i+1)+" "+result[i].headline.main+"</h3>");
		$("#resultsRenderingLocation").append("<p>"+result[i].section_name+"</p>");
		$("#resultsRenderingLocation").append("<p>"+result[i].pub_date+"</p>");
		$("#resultsRenderingLocation").append("<h4><a href='"+result[i].web_url+"'>"+"Click here to read more"+"</a></h4>");
	}
  
}).fail(function(err) {
  throw err;
});
});

