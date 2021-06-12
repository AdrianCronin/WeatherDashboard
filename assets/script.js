var APIkey = "dcfb96a772f695d113cf92e3cf42f4ab";
var testEl = $('#testContainer');
var searchBtnEl = $('#searchBtn');
var searchFormEl = $('#search-form');
var historyBtnsEl = $('#historyBtns');


// this function will add more buttons
function handleButtonAppend(event) {
    event.preventDefault();

    var city = $('input[id="searchBar"]').val();
    console.log("value of city is = " + city);

    historyBtnsEl.append(`
        <button class="button is-light">${city}</button>
    `);

};

searchFormEl.on('submit', handleButtonAppend);

// testEl.append(`

//     <div class="column">
//         First column
//     </div>


// `);


// Take search bar input
    // get api response from weather
    // get api response from forecast
        // throw error if no response from either

    // if not already in history aka memory
        // save to history
        // make history button

    // parse response

        // Display city name and Date

        // display forecast 
            // find icons