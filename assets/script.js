var APIkey = "dcfb96a772f695d113cf92e3cf42f4ab";
var searchBtnEl = $('#searchBtn');
var searchFormEl = $('#search-form');
var historyBtnsEl = $('#historyBtns');
var city;

// this function will take the user's input and use it as an argument for function calls
function handleSubmitEvent(event) {
    event.preventDefault();

    city = $('input[id="searchBar"]').val();

    getCoordApi(city);
    searchHistory(city); // maybe move this into getCoordAPI so it doesnt run when errors
};

// take the user search input and makes a Current Weather API request to get the latitude and longitude of the city
function getCoordApi(city) {
    var coordApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    fetch(coordApi)
        .then(function (response) {
            return response.json(); // make an error message if no response
        })
        .then(function (data) {
            // console.log(data);

            getForecastApi(data.coord); // pass the data.coord object into One Call API request

        });
};

// takes the data.coord object as an argument and makes a One Call API request
function getForecastApi(obj) {
    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + obj.lat + "&lon=" + obj.lon + "&exclude=minutely,hourly&units=imperial&appid=" + APIkey;

    fetch(forecastApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // pass the data into rendering functions
            renderCurrent(data.current);
            renderForecast(data.daily);
        });
};

// take the data.daily[] array as an argument then uses it to create the forecast boxes
function renderForecast(arr) {

    for (i = 1; i < arr.length; i++) {
        var date = new Date(arr[i].dt * 1000).toLocaleDateString("en-US"); // convert into miliseconds
        var container = $('#day' + i);
        container.html('');
        var icon = "https://openweathermap.org/img/w/" + arr[i].weather[0].icon + ".png";
        var temp = arr[i].temp.day;
        var wind = arr[i].wind_speed;
        var humid = arr[i].humidity;
        // render each day to page
        container.append(`
            <p class="title is-4">${date}</p>
            <img src="${icon}">
            <p class="subtitle is-6">Temp: ${temp} °F</p>
            <p class="subtitle is-6">Wind: ${wind} MPH</p>
            <p class="subtitle is-6">Humidity: ${humid} %</p>
        `);
    };
};

// take the data.current[] array as an argument then uses it to create the forecast boxes
function renderCurrent(arr) {
    var container = $('#currentWeather');
    container.html(''); // clear out old stuff
    var date = new Date(arr.dt * 1000).toLocaleDateString("en-US"); // convert into miliseconds
    var icon = "https://openweathermap.org/img/w/" + arr.weather[0].icon + ".png";
    var temp = arr.temp;
    var wind = arr.wind_speed;
    var humid = arr.humidity;
    var uvIndex = arr.uvi;
    var color;
    if (uvIndex > 5) {
        color = "uvRed"
    } else if (uvIndex < 5 && uvIndex > 2) {
        color = "uvYellow"
    } else {
        color = "uvGreen"
    };

    // make UV index change color
    container.append(`
        <p class="title is-3">${city} (${date})<img src="${icon}"></p>
        <p class="subtitle is-6">Temp: ${temp} °F</p>
        <p class="subtitle is-6">Wind: ${wind} MPH</p>
        <p class="subtitle is-6">Humidity: ${humid} %</p>
        <p class="subtitle is-6">UV Index: <span class="${color}"> ${uvIndex}</span></p>
        `);
};

// this function will add to and retrieve from localStorage the search history 
function searchHistory(city) {
    var oldHistory = JSON.parse(localStorage.getItem("searchHistory"));
    var newHistory = [];

    if (!Array.isArray(oldHistory)) {
        newHistory.unshift(city); // if object retrieved from storage is not an array add the city to new history array
    } else {
        newHistory = oldHistory; // add the old history to the new history
    };

    // if add city if missing from newHistory array
    if (!newHistory.includes(city)) {
        newHistory.unshift(city);
    };

    localStorage.setItem("searchHistory", JSON.stringify(newHistory)); // save newHistory array to storage.

    renderBtns(newHistory);
};

// this will make buttons to search cities from the history.
function renderBtns(arr) {
    var container = $('#historyBtns');
    container.html(''); // clear element before rendering

    for (var i = 0; i < arr.length; i++) {
        historyBtnsEl.append(`
            <button class="button is-dark" data-searchbtn="${arr[i]}">${arr[i]}</button>
        `);
    };
};

// search history button even
historyBtnsEl.click(function (event) {
    var target = event.target.getAttribute("data-searchbtn");
    city = target;
    getCoordApi(target);
});

searchFormEl.on('submit', handleSubmitEvent); // Search button event


renderBtns(JSON.parse(localStorage.getItem("searchHistory"))); // initial rendering of buttons in storage






//   // move this to saveHistory
//   historyBtnsEl.append(`
//   <button class="button is-dark">${city}</button>
// `);
