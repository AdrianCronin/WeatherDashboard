var APIkey = "dcfb96a772f695d113cf92e3cf42f4ab";
var searchBtnEl = $('#searchBtn');
var searchFormEl = $('#search-form');
var historyBtnsEl = $('#historyBtns');
// var coords = {};
// var city = "";

// this function will add more buttons
function handleButtonAppend(event) {
    event.preventDefault();

    city = $('input[id="searchBar"]').val();
    // console.log("value of city is = " + city);

    getCoordApi(city);
    searchHistory(city);
};

// Search button event
searchFormEl.on('submit', handleButtonAppend);


// take the user search input and makes a Current Weather API request to get the latitude and longitude of the city
function getCoordApi(city) {
    var coordApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

    fetch(coordApi)
        .then(function (response) {
            return response.json(); // make an error message if no response
        })
        .then(function (data) {
            // console.log(data);

            getForecastApi(data.coord); // have to call this function here due to fetch being asynchronous

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


function searchHistory(city) {
    // if `city` exists in memory, dont add

    var history = JSON.parse(localStorage.getItem("searchHistory"));

    if (!history.includes(city)) {
        history.unshift(city);
    };

    localStorage.setItem("searchHistory", history);


};

var history = JSON.parse(localStorage.getItem("searchHistory"));

console.log(history);


if(history.state == null) {
    history = [];
    history.push('a');
};

console.log(history);





//   // move this to saveHistory
//   historyBtnsEl.append(`
//   <button class="button is-dark">${city}</button>
// `);




// press button
// get localStorage
// if not null
    // JSON.parse into array
    // check array for city
        // if not in array add to array
        // stringify to localStorage
