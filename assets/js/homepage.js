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

  //format date, title, temp, wind, humidity
  let dateFormatted = longDateFormat(weather.dt);
  let cityNameDate = searchTerm + " - " + dateFormatted;
  let tempFormat = tempKtoC(weather.main.temp);
  let windFormat = windMStoMPH(weather.wind.speed);
  let humFormat = humFormatter(weather.main.humidity);

  // create a container for current city weather
  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-center";

  // create span elements for title (city/date), temp, wind and humidity
  var titleEl = document.createElement("span");
  titleEl.textContent = cityNameDate;

  var tempEl = document.createElement("span");
  tempEl.textContent = "Temperature: " + tempFormat;
  tempEl.classList = "list-element";

  var windEl = document.createElement("span");
  windEl.classList = "list-element";
  windEl.textContent = "Wind: " + windFormat;

  var humEl = document.createElement("span");
  humEl.classList = "list-element";
  humEl.textContent = "Humidity: " + humFormat;

  // append title (city & date), temp, wind, humidity spans to parent container
  cityEl.appendChild(titleEl);
  cityContainerEl.appendChild(cityEl);
  cityContainerEl.appendChild(tempEl);
  cityContainerEl.appendChild(windEl);
  cityContainerEl.appendChild(humEl);
};

const displayForecast = function (weather, searchTerm) {
  // clear old content
  forecastContainerEl.textContent = "";

  // console.log(weather);
  // console.log(numericDate);
  // console.log(celsiusTemp);
  // console.log(windMPHF);
  // console.log(humidityPerc);

  for (var i = 6; i < 40; i += 8) {
    //format date, temp, wind, humidity
    let numericDate = shortDateFormat(weather.list[i].dt);
    let celsiusTemp = tempKtoC(weather.list[i].main.temp);
    let windMPHF = windMStoMPH(weather.list[i].wind.speed);
    let humidityPerc = humFormatter(weather.list[i].main.humidity);

    // create a container for the day
    let dayEl = document.createElement("div");
    dayEl.classList = "col-md-5-12 justify-space-between align-center";

    // create span elements for date, temp, wind and humidity
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

    // append date, temp, wind, humidity spans to day div
    dayEl.appendChild(numericDateEl);
    dayEl.appendChild(celsiusTempEl);
    dayEl.appendChild(windEl);
    dayEl.appendChild(humEl);

    // append day div to parent forecast container
    forecastContainerEl.appendChild(dayEl);
  }
};

cityFormEl.addEventListener("submit", formSubmitHandler);
