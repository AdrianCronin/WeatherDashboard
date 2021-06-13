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

// change this to call user input

function getApi () {
    
    var coordApi = "https://api.openweathermap.org/data/2.5/weather?q=East%20Wenatchee&appid=dcfb96a772f695d113cf92e3cf42f4ab";

    fetch(coordApi)
     .then (function (response) {
        return response.json();
     })
      .then (function (data) {
        coords = data.coord;
        console.log(coords); // this logs what I want
      });
    console.log(coords); // this logs before the fetch request for some reason
}

getApi();
console.log(coords); 






















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