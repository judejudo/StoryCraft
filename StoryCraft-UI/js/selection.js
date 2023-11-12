const BASE_URL = 'http://api.mystorycraft.studio/';

let slideIndex = 1;
let language = "English";
let animal = "lion";
let place = "beach";
let talent = "singing";
let hero = "spiderman";
let mood = "happy";

showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("question");
    let lines = document.getElementsByClassName("line");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < lines.length; i++) {
        lines[i].className = lines[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    lines[slideIndex - 1].className += " active";
}

function getLanguage(lang) {
    language = lang;
}

function getAnimal(name) {
    animal = name;
}

function getPlace(name) {
    place = name;
}

function getTalent(name) {
    talent = name;
}

function getHero(name) {
    hero = name;
}

function getMood(name) {
    mood = name;
}



async function generateStory() {
    document.getElementById("loaderContainer").style.visibility = "visible";
    var uid = localStorage.getItem("uid");
    const jsonBody = {
        "uid": uid,
        "name": document.getElementById("name").value,
        "age": document.getElementById("age").value,
        "choices": {
            "language": language,
            "favorite_animal": animal,
            "exciting_place": place,
            "special_interest": talent,
            "superhero": hero,
            "mood": mood
        }
    }

    setTimeout(() => {
        document.getElementById("playGame").style.visibility = "visible";
    }, 10000);

    const response = await fetch(BASE_URL + 'generate_story', {
        method: 'POST',
        body: JSON.stringify(jsonBody),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseJson = await response.json();
    localStorage.setItem("story", JSON.stringify(responseJson));
    let storyw = localStorage.getItem("story");
    window.open("storybook.html", "_self");
}

function set(key, value) { localStorage.setItem(key, value); }
function get(key) { return localStorage.getItem(key); }
function increase(el) { set(el, parseInt(get(el)) + 1); }
function decrease(el) { set(el, parseInt(get(el)) - 1); }

var toTime = function (nr) {
    if (nr == '-:-') return nr;
    else { var n = ' ' + nr / 1000 + ' '; return n.substr(0, n.length - 1) + 's'; }
};

const animalsArray = ['bear', 'cat', 'cow', 'dog', 'duck', 'goat', 'hen', 'monkey']

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};


$('.play').on('click', function () {
    increase('flip_abandoned');
    $('.info').fadeOut();

    var difficulty = 'casual',
        level = 8;

    $('#g').addClass(difficulty);

    $('.logo').fadeOut(250, function () {
        var startGame = $.now(),
            obj = [];

        for (i = 0; i < animalsArray.length; i++) {
            obj.push(animalsArray[i]);
        }

        var shu = shuffle($.merge(obj, obj)),
            cardSize = 100 / Math.sqrt(shu.length);

        for (i = 0; i < shu.length; i++) {
            var code = shu[i];
            $('<div class="card" style="width:' + cardSize + '%;height:' + cardSize + '%;">' +
                `<div class="flipper"><div class="f"></div><div class="b" data-f="${code}" style="text-align:center;"><img src="../images/game/${code}.png" style="width:100px;text-align:center;"></div></div>` +
                '</div>').appendTo('#g');
        }

        //sacred code
        $('#g .card').on({
            'mousedown': function () {
                if ($('#g').attr('data-paused') == 1) { return; }
                var data = $(this).addClass('active').find('.b').attr('data-f');

                if ($('#g').find('.card.active').length > 1) {
                    setTimeout(function () {
                        var thisCard = $('#g .active .b[data-f=' + data + ']');

                        if (thisCard.length > 1) {
                            thisCard.parents('.card').toggleClass('active card found').empty();


                            if (!$('#g .card').length) {

                                alert("Congrats")
                            }
                        }
                        else {
                            $('#g .card.active').removeClass('active');
                        }
                    }, 401);
                }
            }
        });
        document.getElementById("g").style.display = "block";
        // setTimeout(() => {
        //     document.getElementById("g").innerHTML += '<div class="cont_completed"><p>Your story is ready</p><button class="completed_loading">Start Reading</button></div>'
        // }, 1000);
    });
});

