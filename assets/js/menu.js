const toggleButton = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const trp = document.getElementById("trp");

toggleButton.addEventListener("click", () => {
    menu.style.left = "-340px";
    menu.style.display = "flex";
    $("#menu").animate({left: '0px'}, 500);
    // trp.style.display = "block";
    $("#trp").fadeIn(500);
});

trp.addEventListener("click", () => {
    $("#menu").animate({left: '-340px'}, 500);
    $("#trp").fadeOut(500);
    // menu.style.display = "none";
    // trp.style.display = "none";
});