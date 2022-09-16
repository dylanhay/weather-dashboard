const APIKey = "3622ba7833d750499f399b0571300cb8";

var getWeather = function(city) {
    // format the OpenWeather query URL
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  
    // make a request to the url
    fetch(queryURL).then(function(response) {
      response.json().then(function(data) {
        console.log(data);
      });
    });
  };

getWeather("Nanaimo");
