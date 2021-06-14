var APIkey = "dcfb96a772f695d113cf92e3cf42f4ab";
var searchBtnEl = $('#searchBtn');
var searchFormEl = $('#search-form');
var historyBtnsEl = $('#historyBtns');
var city;

// this function will take the user's input and use it as an argument for function calls
function handleSubmitEvent(event) {
    event.preventDefault();
    city = $('input[id="searchBar"]').val();
    city = capitalize(city); // take the user input and clean it up
    if (city === '') {
        $('#currentWeather').html(`<p class="title is-3">Please Enter a City</p>`);
        $('#forecast').html('');
        $('#forecastTitle').html('');
    } else {  
        getCoordApi(city);
    };
};

// take the user search input and makes a Current Weather API request to get the latitude and longitude of the city
function getCoordApi(city) {
    var coordApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    fetch(coordApi)
        .then(function (response) {
            if (response.status !== 200) {
                $('#currentWeather').html(`<p class="title is-3">I'm sorry, we cannot find "${city}"</p>`);
                $('#forecast').html('');
                $('#forecastTitle').html('');
                return;
            } else {
                searchHistory(city); // only add to history if valid search
            };

            return response.json();
        })
        .then(function (data) {

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
            // pass only the data needed into the rendering functions
            renderCurrent(data.current);
            renderForecast(data.daily);
        });
};

// take the data.daily array as an argument then uses it to create the forecast boxes
function renderForecast(arr) {
    var container = $('#forecast');
    container.html(''); // clear the container before rendering more
    $('#forecastTitle').html('5-Day Forecast:');

    // for loop iteratively generates the forecast boxes
    for (i = 1; i < 6; i++) {
        var date = new Date(arr[i].dt * 1000).toLocaleDateString("en-US"); // convert into miliseconds
        var icon = "https://openweathermap.org/img/w/" + arr[i].weather[0].icon + ".png";
        var temp = arr[i].temp.day;
        var wind = arr[i].wind_speed;
        var humid = arr[i].humidity;

        container.append(`
            <div class="column is-one-fifth">
                <div class="forecastBox" id="day${i}">
                    <p class="title is-4">${date}</p>
                    <img src="${icon}">
                    <p class="subtitle is-6">Temp: ${temp} °F</p>
                    <p class="subtitle is-6">Wind: ${wind} MPH</p>
                    <p class="subtitle is-6">Humidity: ${humid} %</p>
                </div>
            </div>
        `);
    };
};

// take the data.current[] array as an argument then uses it to create the current weather box
function renderCurrent(arr) {
    var container = $('#currentWeather');
    container.html(''); // clear out old stuff
    container.addClass('currentWeatherBorder');
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

    // populates the element with current weather
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

    // add city if missing from newHistory array
    if (!newHistory.includes(city)) {
        newHistory.unshift(city);
    };

    localStorage.setItem("searchHistory", JSON.stringify(newHistory)); // save newHistory array to storage.

    renderBtns(newHistory); // re-renders buttons with new list
};

// this will make buttons to search cities from the history.
function renderBtns(arr) {
    var container = $('#historyBtns');
    container.html(''); // clear element before rendering

    // for loop iteratively creates buttons for each city in the array 
    for (var i = 0; i < arr.length; i++) {
        historyBtnsEl.append(`
            <button class="button is-dark" data-searchbtn="${arr[i]}">${arr[i]}</button>
        `);
    };
};

// this function takes the user's input and cleans it up removing white space and capitalizing each word
function capitalize(str) {
    str = str.trim().toLowerCase(); // remove extra whitespace and change all letters to lower case
    var words = str.split(' ') // split string into array of individual words
    str = ''; // clear string variable since all the words are saved in an array
    // this loop takes each word in the array and capitalizes the first letter then adds each word to the new string with a space following 
    for (i = 0; i < words.length; i++) {
        var foo = words[i];
        foo = foo.charAt(0).toUpperCase() + foo.slice(1);
        str += foo + " ";
    }
    return str.trim(); // return the new string with the last space removed
};

// search history button event
historyBtnsEl.click(function (event) {
    var target = event.target.getAttribute("data-searchbtn");

    if (target === null) {
        return
    } else {
        city = target;
        getCoordApi(target);
    };
});

searchFormEl.on('submit', handleSubmitEvent); // Search button event

renderBtns(JSON.parse(localStorage.getItem("searchHistory"))); // render buttons out of storage on page load
