var APIkey = "dcfb96a772f695d113cf92e3cf42f4ab";
var testEl = $('#testContainer');
var searchBtnEl = $('#searchBtn');
var searchFormEl = $('#search-form');
var historyBtnsEl = $('#historyBtns');
var coords = {};


// this function will add more buttons
function handleButtonAppend(event) {
    event.preventDefault();

    var city = $('input[id="searchBar"]').val();
    console.log("value of city is = " + city);

    historyBtnsEl.append(`
        <button class="button is-dark">${city}</button>
    `);
};

// Search button event
searchFormEl.on('submit', handleButtonAppend);


// take the user search input and makes a Current Weather API request to get the latitude and longitude of the city
function getCoordApi() {

    // change this to call user input
    var coordApi = "https://api.openweathermap.org/data/2.5/weather?q=East%20Wenatchee&appid=" + APIkey;

    fetch(coordApi)
        .then(function (response) {
            return response.json(); // make an error message if no response
        })
        .then(function (data) {

            getForecastApi(data.coord); // have to call this function here due to fetch being asynchronous

        });
    ;
}


getCoordApi();


// takes the data.coord object as an argument and makes a One Call API request
function getForecastApi(obj) {
    var forecastApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + obj.lat + "&lon=" + obj.lon + "&exclude=current,minutely,hourly&appid=" + APIkey;

    fetch(forecastApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data.daily);
            renderForecast(data.daily);
        });
};


// take the data.daily[] array as an argument then uses it to create the forecast boxes
function renderForecast(arr) {

    console.log(arr[0].dt)
    // console.log(Date(arr[0].dt));
    var date = new Date(arr[1].dt * 1000).toLocaleDateString("en-US");
    console.log(date);
}






















// testEl.append(`

//     <div class="column">
//         First column
//     </div>


// `);


// Take search bar input
    // get api response from weather with city name
        // get lat and lon from response
        // throw error if no response 
    // get api response from onecall using Lat and Lon

    // if not already in history aka memory
        // save to history
        // make history button

    // parse response

        // Display city name and Date

        // display forecast 
            // find icons