var apiKey = "&units=imperial&appid=faa459a21acc3917147c52be955e1a1b";
var city = "Dallas";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+apiKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    console.log(response);
})