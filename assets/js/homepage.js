const APIKey = "3622ba7833d750499f399b0571300cb8";

var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var cityname = nameInputEl.value.trim();

  if (cityname) {
    getWeather(cityname);
    nameInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
  // console.log(event);
};

var getWeather = function (city) {
  // format the OpenWeather query URL
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;

  // make a request to the url
  fetch(queryURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

var displayWeather = function (weather, searchTerm) {
  console.log(weather);
  console.log(searchTerm);
  // clear old content
  cityContainerEl.textContent = "";
  citySearchTerm.textContent = searchTerm;
  
};

cityFormEl.addEventListener("submit", formSubmitHandler);
