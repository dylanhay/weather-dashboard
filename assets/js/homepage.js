const APIKey = "3622ba7833d750499f399b0571300cb8";

var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");
var forecastContainerEl = document.querySelector("#forecast-container");

var formSubmitHandler = function (event) {
  event.preventDefault();
  // get value from input element
  var cityname = nameInputEl.value.trim();

  if (cityname) {
    getWeather(cityname);
    getForecast(cityname);
    nameInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
  // console.log(event);
};

var getWeather = function (city) {
  // OpenWeather query URL for current weather
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
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

var getForecast = function (city) {
  // OpenWeather query URL for forecast
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey;

  // make a request to the url
  fetch(queryURL).then(function (response) {
    response.json().then(function (data) {
      console.log("placeholder");
      // displayForecast(data, city);
    });
  });
};

var displayWeather = function (weather, searchTerm) {
  console.log(weather);
  console.log(searchTerm);
  // clear old content
  cityContainerEl.textContent = "";
  citySearchTerm.textContent = searchTerm;

  //convert date from unix
  var weatherMS = weather.dt * 1000;
  console.log(weatherMS);
  const dateObject = new Date(weatherMS);
  const month = dateObject.toLocaleString("en-US", { month: "long" });
  const day = dateObject.toLocaleString("en-US", { day: "numeric" });
  const year = dateObject.toLocaleString("en-US", { year: "numeric" });
  const dateFormatted = month + " " + day + ", " + year;

  // format city name and current date
  var cityNameDate = searchTerm + " - " + dateFormatted;

  // create a container for the current city and date
  var cityEl = document.createElement("div");
  cityEl.classList = "list-item flex-row justify-space-between align-center";

  // create a span element to hold the city name and current date
  var titleEl = document.createElement("span");
  titleEl.textContent = cityNameDate;

  // append to container
  cityEl.appendChild(titleEl);

  // append container to the dom
  cityContainerEl.appendChild(cityEl);

  //convert temp from Kelvin to Celsius
  var tempK = weather.main.temp;
  var tempC = tempK - 273.15;
  var tempCInt = Math.round(tempC);
  var tempFormat = tempCInt + "\u00B0" + "C";

  // create a container for the current city and date
  var currentWeatherEl = document.createElement("div");
  currentWeatherEl.classList = "list-item";

  // create a span element to hold the current temp
  var tempEl = document.createElement("span");
  tempEl.textContent = "Temperature: " + tempFormat;
  tempEl.classList = "list-element";

  // append to container
  cityEl.appendChild(tempEl);

  // append container to the dom
  cityContainerEl.appendChild(tempEl);

  //convert wind from metres/second to miles/hour
  var windMetresSec = weather.wind.speed;
  var windMPH = windMetresSec * 2.23694;
  var windMPH2 = windMPH.toFixed(2);
  var windFormat = windMPH2 + " MPH";
  console.log(windFormat);

  // create a span element to hold the current wind speed
  var windEl = document.createElement("span");
  windEl.classList = "list-element";
  windEl.textContent = "Wind: " + windFormat;

  // append to container
  cityEl.appendChild(windEl);

  // append container to the dom
  cityContainerEl.appendChild(windEl);

  //convert humidity from metres/second to miles/hour
  var humNumeric = weather.main.humidity;
  var humFormat = humNumeric + "%";

  // create a span element to hold the current wind speed
  var humEl = document.createElement("span");
  humEl.classList = "list-element";
  humEl.textContent = "Humidity: " + humFormat;

  // append to container
  cityEl.appendChild(humEl);

  // append container to the dom
  cityContainerEl.appendChild(humEl);
};

var displayForecast = function (weather, searchTerm) {
  console.log(weather);

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
