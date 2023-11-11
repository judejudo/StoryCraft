const BASE_URL = 'api.mystorycraft.studio';

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
        "choices": [
            {
                "language": language,
                "favorite_animal": animal,
                "exciting_place": place,
                "special_interest": talent,
                "superhero": hero,
                "mood": mood
            }
        ]
    }

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