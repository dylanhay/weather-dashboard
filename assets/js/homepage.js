const APIKey = "3622ba7833d750499f399b0571300cb8";

var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");
var forecastContainerEl = document.querySelector("#forecast-container");

//convert unix timestamp to MM/DD/YYYY
const shortDateFormat = function (unixDate) {
  let weatherMS = unixDate * 1000;
  let dateObject = new Date(weatherMS);
  let month = dateObject.toLocaleString("en-US", { month: "numeric" });
  let day = dateObject.toLocaleString("en-US", { day: "numeric" });
  let year = dateObject.toLocaleString("en-US", { year: "numeric" });
  let dateFormatted = month + "/" + day + "/" + year;
  return dateFormatted;
};

//convert unix timestamp to long format (ex. September 13, 2022)
const longDateFormat = function (unixDate) {
  let weatherMS = unixDate * 1000;
  let dateObject = new Date(weatherMS);
  let month = dateObject.toLocaleString("en-US", { month: "long" });
  let day = dateObject.toLocaleString("en-US", { day: "numeric" });
  let year = dateObject.toLocaleString("en-US", { year: "numeric" });
  let dateFormatted = month + " " + day + ", " + year;
  return dateFormatted;
};

//convert kelvin temperature to degC
const tempKtoC = function (tempK) {
  let tempC = tempK - 273.15;
  let tempCInt = Math.round(tempC);
  let tempFormat = tempCInt + "\u00B0" + "C";
  return tempFormat;
};

//convert wind speed from metres/sec to mph
const windMStoMPH = function (windMS) {
  var windMPH = (windMS * 2.23694).toFixed(2);
  var windFormat = windMPH + " MPH";
  return windFormat;
};

//format humidity to include percentage symbol
const humFormatter = function (humNumeric) {
  let humFormat = humNumeric + "%";
  return humFormat;
};

// get value from form input
var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityname = nameInputEl.value.trim();

  if (cityname) {
    getWeather(cityname);
    getForecast(cityname);
    nameInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

// OpenWeather queryURL and request for current weather
var getWeather = function (city) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;

  fetch(queryURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

// OpenWeather queryURL and request for weather forecast
var getForecast = function (city) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;

  fetch(queryURL).then(function (response) {
    response.json().then(function (data) {
      displayForecast(data, city);
    });
  });
};

//build and display front-end for current weather
var displayWeather = function (weather, searchTerm) {
  // clear old content
  cityContainerEl.textContent = "";
  citySearchTerm.textContent = searchTerm;

  //convert date from unix timestamp
  let dateFormatted = longDateFormat(weather.dt);

  // format city name and current date
  var cityNameDate = searchTerm + " - " + dateFormatted;

  // create a container for the current city and date
  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-center";

  // create a span element to hold the city name and current date
  var titleEl = document.createElement("span");
  titleEl.textContent = cityNameDate;

  // append title span to container
  cityEl.appendChild(titleEl);

  // append city div to parent container
  cityContainerEl.appendChild(cityEl);

  //convert temp from Kelvin to Celsius
  let tempFormat = tempKtoC(weather.main.temp);

  // create a container for the current city and date
  var currentWeatherEl = document.createElement("div");
  currentWeatherEl.classList = "list-item";

  // create a span element to hold the current temp
  var tempEl = document.createElement("span");
  tempEl.textContent = "Temperature: " + tempFormat;
  tempEl.classList = "list-element";

  // append temp span to container
  cityContainerEl.appendChild(tempEl);

  //convert wind from metres/second to miles/hour
  let windFormat = windMStoMPH(weather.wind.speed);

  // create a span element to hold the current wind speed
  var windEl = document.createElement("span");
  windEl.classList = "list-element";
  windEl.textContent = "Wind: " + windFormat;

  // append wind span to container
  cityContainerEl.appendChild(windEl);

  //convert humidity from metres/second to miles/hour
  let humFormat = humFormatter(weather.main.humidity);

  // create a span element to hold the current wind speed
  var humEl = document.createElement("span");
  humEl.classList = "list-element";
  humEl.textContent = "Humidity: " + humFormat;

  // append humidity span to container
  cityContainerEl.appendChild(humEl);
};

const displayForecast = function (weather, searchTerm) {
  // clear old content
  // forecastContainerEl.textContent = "";

  console.log(weather);

  let numericDate = shortDateFormat(weather.list[6].dt);
  console.log(numericDate);

  let celsiusTemp = tempKtoC(weather.list[6].main.temp);
  console.log(celsiusTemp);

  let windMPHF = windMStoMPH(weather.list[6].wind.speed);
  console.log(windMPHF);

  let humidityPerc = humFormatter(weather.list[6].main.humidity);
  console.log(humidityPerc);

  // create a container for the day
  let dayEl = document.createElement("div");
  dayEl.classList = "col-auto justify-space-between align-center";

  // create a span elements for date, temp, wind and humidity
  var numericDateEl = document.createElement("span");
  numericDateEl.classList = "list-element";
  numericDateEl.textContent = numericDate;
  
  var celsiusTempEl = document.createElement("span");
  celsiusTempEl.classList = "list-element";
  celsiusTempEl.textContent = "Temperature: " + celsiusTemp;
  
  var windEl = document.createElement("span");
  windEl.classList = "list-element";
  windEl.textContent = "Wind: " + windMPHF;
  
  var humEl = document.createElement("span");
  humEl.classList = "list-element";
  humEl.textContent = "Humidity: " + humidityPerc;

  // append date span to container
  dayEl.appendChild(numericDateEl);
  dayEl.appendChild(celsiusTempEl);
  dayEl.appendChild(windEl);
  dayEl.appendChild(humEl);

  // append day div to parent forecast container
  forecastContainerEl.appendChild(dayEl);

  // for (var i = 0; i < 5; i++) {
  //   // format repo name
  //   var weatherParent = repos[i].owner.login + "/" + repos[i].name;

  //   // create a container for each repo
  //   var repoEl = document.createElement("div");
  //   repoEl.classList = "list-item flex-row justify-space-between align-center";

  //   // create a span element to hold repository name
  //   var titleEl = document.createElement("span");
  //   titleEl.textContent = repoName;

  //   // append to container
  //   repoEl.appendChild(titleEl);

  //   // create a status element
  //   var statusEl = document.createElement("span");
  //   statusEl.classList = "flex-row align-center";

  //   // append to container
  //   repoEl.appendChild(statusEl);

  //   // append container to the dom
  //   repoContainerEl.appendChild(repoEl);
  // }

  // console.log(searchTerm);
  // clear old content
  // cityContainerEl.textContent = "";
  // citySearchTerm.textContent = searchTerm;
};

cityFormEl.addEventListener("submit", formSubmitHandler);
