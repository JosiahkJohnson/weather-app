//global variables
var quickSearch = []; //array that stores a name of recently searched cities
//store selector variables here
var $searchBox = $("#city-search");
var $searchButton = $("#search-button");

//setting click functions to the search button and the quick search menu
$searchButton.on("click", function(event){
    event.preventDefault();
    var cityName = $searchBox.val();

    quickSearch.push(cityName);
    //this next line limits the recent searches to 10
    if(quickSearch.length > 10){quickSearch.shift();}
    storeData(quickSearch);
    printList(quickSearch);
    setMainInfo(cityName);
})

//add a city name to recent searches list
function printList(array){
    var $listGroup = $(".list-group");
    $listGroup.empty();

    //prints out the list
    for(i=0;i<array.length;i++){
        var $newItem = $("<li>");
    
        $newItem.addClass("list-group-item");
        $newItem.attr("id",array[i]);
        $newItem.text(array[i]);
        $newItem.on("click", function(event){
            event.preventDefault();
            setMainInfo($(this).attr("id"));
        });
        $listGroup.prepend($newItem);
    }
}

//updates the main info page and also will call the 5 day forecast function
function setMainInfo(city){
    //api info variables
    var apiKey = "&units=imperial&appid=faa459a21acc3917147c52be955e1a1b";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
    var uvApiKey = "faa459a21acc3917147c52be955e1a1b&lat=";
    var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=";
    //selector variables
    var $cityName = $(".city-name");
    var $temp = $("#temp");
    var $humidity = $("#humidity");
    var $windSpeed = $("#wind");
    var $uvIndex = $("#uv");
    var $icon = $("#main-icon");
    var iconCode;

    //latatude and longitude variables for determining UV index
    var lat;
    var lon;

    //fill in what we do know
    $cityName.text(city + " (" + moment().format('L') + ")");

    //call info from the server to fill out what we don't know
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        console.log(response.weather[0].icon);
        iconCode = response.weather[0].icon;
        $temp.text("Temperature: "+response.main.temp+String.fromCharCode(176)+"F");
        $humidity.text("Humidity: "+response.main.humidity+"%");
        $windSpeed.text("Wind Speed: " + response.wind.speed + "MPH");
        lat = response.coord.lat;
        lon = response.coord.lon;
        //set the icon
        $icon.attr("src", "http://openweathermap.org/img/wn/"+iconCode+"@2x.png");
        //.then get the uv index so I can set that, but we need the lat and lon to have a value first
        $.ajax({
            url: uvUrl + uvApiKey + lat + "&lon=" + lon,
            method: "GET"
        }).then(function(response){
            $uvIndex.text("UV Index: " + response.value);
        })
    })
    //call the correct icon
    

    //create the 5 day forecast section
    var $forecastBox = $(".forecast");
    //also empty it
    $forecastBox.empty();
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=faa459a21acc3917147c52be955e1a1b";

    //call the server for the info
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        
        //so the daily forecast is a paid subscription to this API so I had to improvise
        //I could get the three hour interval info from it so I made this loop count by 8
        //in order to give me the daily 5 day forecast
        for(i=0;i<response.list.length;i+=8){
            console.log(response.list[i]);
            //create the new box to place the forecast in
            var $newForecast = $("<div>");
            $newForecast.addClass("day bg-primary text-white");
            var $title = $("<h5>");
            //create first line in five day forecast
            $title.text(moment().add(((i+8)/8-1), 'days').format('L'));
            $newForecast.append($title);
            //add temp
            var $temp = $("<p>");
            $temp.text("Temp: " + response.list[i].main.temp + String.fromCharCode(176) + "F");
            $newForecast.append($temp);
            //add humidity
            var $humidity = $("<p>");
            $humidity.text("Humidity: " + response.list[i].main.humidity + "%");
            $newForecast.append($humidity);
            //append to the forecast
            $forecastBox.append($newForecast);
        }
    })
}

//store data to local storage function
function storeData(data){
    localStorage.setItem("quickSearch", JSON.stringify(data));
}
//calling functions on run here
//load saved city data if exists
if(JSON.parse(localStorage.getItem("quickSearch"))!=null){
    quickSearch = JSON.parse(localStorage.getItem("quickSearch"));
    printList(quickSearch);
    setMainInfo(quickSearch[quickSearch.length-1]);
}
