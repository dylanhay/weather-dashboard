//API key for openweatherapp.org/api
const APIKey = "31eb12de988177001ef05a7631d3bf7e";

//select and declare variables for elements from HTML
var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");
var forecastContainerEl = document.querySelector("#forecast-container");
var historyContainerEl = document.querySelector("#search-history");
var clearHistoryButton = document.querySelector("#clear-history");
var userSearchHistory = JSON.parse(localStorage.getItem("allEntries")) || [];

//hide clear history button initially
clearHistoryButton.style.visibility = "hidden";

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

//display weather icon .png with iconcode as input
const iconFormatter = function (iconcode) {
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  return iconurl;
};

// get value from form input
var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityname = nameInputEl.value.trim();

  if (cityname) {
    getWeather(cityname);
    getForecast(cityname);
    displaySearchHistory(cityname);
    storageSaver(cityname);
    nameInputEl.value = "";
    console.log(localStorage);
  } else {
    alert("Please enter a city");
  }
};

//local storage for city search entries
const storageSaver = function (searchedCity) {
  var allEntries = JSON.parse(localStorage.getItem("allEntries"));
  if (allEntries == null) {
    allEntries = [];
  }
  localStorage.setItem("entry", JSON.stringify(searchedCity));
  // Save allEntries back to local storage
  allEntries.push(searchedCity);
  localStorage.setItem("allEntries", JSON.stringify(allEntries));
};

// OpenWeather queryURL and request for current weather
var getWeather = function (city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
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
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
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
  let dateFormat = dateFormatted;
  let tempFormat = tempKtoC(weather.main.temp);
  let windFormat = windMStoMPH(weather.wind.speed);
  let humFormat = humFormatter(weather.main.humidity);
  let iconFormat = iconFormatter(weather.weather[0].icon);

  // create a container for current city name and date
  var cityEl = document.createElement("div");
  cityEl.classList = "flex-row justify-center align-center";

  // create a container for elements
  var flexEl = document.createElement("div");
  flexEl.classList = "flex-parent";

  // create elements for title (city/date), icon, temp, wind and humidity
  var titleEl = document.createElement("div");
  titleEl.classList = "current-date";
  titleEl.textContent = dateFormat;

  var iconEl = document.createElement("div");
  iconEl.classList = "col-md-3 flex-column justify-center align-center";
  var iconImg = document.createElement("img");
  iconImg.id = "cwicon";
  iconImg.src = iconFormat;
  iconEl.appendChild(iconImg);

  var tempEl = document.createElement("div");
  tempEl.textContent = "Temperature: " + tempFormat;
  tempEl.classList = "col-md-3 flex-column justify-center align-center";

  var windEl = document.createElement("div");
  windEl.classList = "col-md-3 flex-column justify-center align-center";
  windEl.textContent = "Wind: " + windFormat;

  var humEl = document.createElement("div");
  humEl.classList = "col-md-3 flex-column justify-center align-center";
  humEl.textContent = "Humidity: " + humFormat;

  // append title (city & date), temp, wind, humidity spans to parent container
  cityEl.appendChild(titleEl);
  cityContainerEl.appendChild(cityEl);

  flexEl.appendChild(iconEl);
  flexEl.appendChild(tempEl);
  flexEl.appendChild(windEl);
  flexEl.appendChild(humEl);
  cityContainerEl.appendChild(flexEl);
};

//build and display front-end for five day forecast
const displayForecast = function (weather) {
  
  console.log(weather);
  
  // clear old content
  forecastContainerEl.textContent = "";

  for (var i = 7; i < 40; i += 8) {
    //format date, temp, wind, humidity
    let numericDate = shortDateFormat(weather.list[i].dt);
    let celsiusTemp = tempKtoC(weather.list[i].main.temp);
    let windMPHF = windMStoMPH(weather.list[i].wind.speed);
    let humidityPerc = humFormatter(weather.list[i].main.humidity);
    let iconFormat = iconFormatter(weather.list[i].weather[0].icon);

    // create a container for the day
    let dayEl = document.createElement("div");
    dayEl.classList = "card col-md-5-12 space-evenly align-center";

    // create div elements for date, icon, temp, wind and humidity
    var numericDateEl = document.createElement("div");
    numericDateEl.classList = "forecast-date";
    numericDateEl.textContent = numericDate;

    var iconEl = document.createElement("div");
    iconEl.classList = "forecast-element";
    var iconImg = document.createElement("img");
    iconImg.id = "cwicon";
    iconImg.src = iconFormat;
    iconEl.appendChild(iconImg);

    var celsiusTempEl = document.createElement("div");
    celsiusTempEl.classList = "forecast-element";
    celsiusTempEl.textContent = "Temp: " + celsiusTemp;

    var windEl = document.createElement("div");
    windEl.classList = "forecast-element";
    windEl.textContent = "Wind: " + windMPHF;

    var humEl = document.createElement("div");
    humEl.classList = "forecast-element";
    humEl.textContent = "Humidity: " + humidityPerc;

    // append date, temp, wind, humidity spans to day div
    dayEl.appendChild(numericDateEl);
    dayEl.appendChild(iconEl);
    dayEl.appendChild(celsiusTempEl);
    dayEl.appendChild(windEl);
    dayEl.appendChild(humEl);

    // append day div to parent forecast container
    forecastContainerEl.appendChild(dayEl);
  }
};

// display search history elements
const displaySearchHistory = function (searchTerm) {
  let searchEl = document.createElement("div");
  searchEl.textContent = searchTerm;
  searchEl.classList = "list-item flex-row align-center justify-center";
  searchEl.onclick = function () {
    histButtonHandler(searchTerm);
  };

  // append search div to parent history container
  historyContainerEl.appendChild(searchEl);
  //make clear history button visible
  clearHistoryButton.style.visibility = "visible";
};

// display local storage div elements
const displayStorageHistory = function (userSearchHistoryArr) {
  for (var i = 0; i < userSearchHistoryArr.length; i++) {
  
  let searchEl = document.createElement("div");
  searchEl.textContent = userSearchHistoryArr[i];
  searchEl.classList = "list-item flex-row align-center justify-center";
  searchEl.onclick = function () {
    histButtonHandler(searchEl.textContent);
  };

  // append search div to parent history container
  historyContainerEl.appendChild(searchEl);
  //make clear history button visible
  clearHistoryButton.style.visibility = "visible";
};
};

//display local storage search history on page load
if (userSearchHistory !== null) {
  displayStorageHistory(userSearchHistory);
}

//load current weather forecast when historical city is selected
const histButtonHandler = function (cityname) {
  getWeather(cityname);
  getForecast(cityname);
};

//clear history button functionality
clearHistoryButton.onclick = function () {
  historyContainerEl.textContent = "";
  clearHistoryButton.style.visibility = "hidden";
  localStorage.clear();
  console.log(localStorage);
};

cityFormEl.addEventListener("submit", formSubmitHandler);
