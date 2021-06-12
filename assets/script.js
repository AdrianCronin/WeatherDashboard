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