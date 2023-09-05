var currentStatus = 0;
var searchText = null;
var searchResults = null;

const searchInput = document.getElementById("search-input");
const statusItems = document.querySelectorAll(".filters > .status > .status-item");


function convertSelectedToNumber(filterName){
    const data = {
        "Hepsi": 0,
        "Kötü": 1,
        "Normal": 2,
        "İyi": 3,
    };

    return data[filterName];
}

function changeActiveFilter(filter){
    statusItems.forEach(item => {
        item.removeAttribute("status");
    });

    filter.setAttribute("status", "active");
    currentStatus = convertSelectedToNumber(filter.innerText);
}

searchInput.addEventListener("input", (e) => {
    searchText = e.target.value;
    console.log(e.target.value);
});

statusItems.forEach(item => {
    item.addEventListener("click", (e) => {
        changeActiveFilter(e.target);
    });
});