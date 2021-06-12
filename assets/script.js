var testEl = $('#testContainer');
var searchBtnEl = $('#searchBtn');
var searchFormEl = $('#search-form');
var historyBtnsEl = $('#searchBtn');

function handleSearch(event) {
    event.preventDefault();

    var city = $('input[id="searchBar"]').val();
    console.log("value of city is = " + city);



};

searchFormEl.on('submit', handleSearch);

// testEl.append(`

//     <div class="column">
//         First column
//     </div>


// `);