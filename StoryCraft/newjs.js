var flipbookEL = document.getElementById('flipbook');

// window.addEventListener('resize', function (e) {
//     flipbookEL.style.width = '';
//     flipbookEL.style.height = '';
//     $(flipbookEL).turn('size', flipbookEL.clientWidth, flipbookEL.clientHeight);
// });

$(flipbookEL).turn({
    duration: 1500,
    width: 1500,
    height: 900,
    display: 'single',
    turnCorners: "bl,br",
    elevation: 300
});
