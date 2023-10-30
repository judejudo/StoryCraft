let story = JSON.parse(localStorage.getItem("story"));
let pageImages = story.images;
let paragraphs = story.parts;
let questions = story.questions;
let clickNum = 0;
let questionNum = 0;
let clickableParagraphs = [];
let pageCount = story.images.length;
var flipbookEL = document.getElementById('flipbook');
var moreAction = document.getElementById('moreOptions');
let phrase = "";
let pageIndex = 1;
const BASE_URL = 'http://127.0.0.1:5000/';
let dataArray = [];
let recorder;
let audioIN = { audio: true }
let start = document.getElementById("startRecording");

var config = {
    apiKey: "",
    authDomain: "a2sv-hackathon.firebaseapp.com",
    projectId: "a2sv-hackathon",
    storageBucket: "a2sv-hackathon.appspot.com",
    messagingSenderId: "335557285236",
    appId: "1:335557285236:web:95de9a7b59613041ef8821",
    measurementId: "G-TJ192BJEB9"
};
firebase.initializeApp(config);

const bucketName = "sound_buckets";
const clientID = "";
const accessToken = "";
var form = document.createElement("form");

document.getElementById("sourceAudio").src = story.audio;

$(".option").click(function () {
    $(".option").removeClass("active");
    $(this).addClass("active");
});

$(".option-bottom").click(function () {
    $(".option-bottom").removeClass("active");
    $(this).addClass("active");
});


for (let i = 0; i < paragraphs.length; i++) {
    let splits = paragraphs[i].match(/\b(\w+\W+)/g);
    let html = `<p>`;
    for (let j = 0; j < splits.length; j++) {
        html += `<span class=\"story-span-text\" onClick=getMeaning(event,'${splits[j].trim()}')>${splits[j]} <span class=\"text-meaning hidden-meaning\">pipi</span></span>`;
    }
    html += `</p>`;
    clickableParagraphs.push(html);
}


for (let i = 0; i < pageCount; i++) {
    flipbookEL.innerHTML += `<div class="page">
                                <div class="image-container">
                                    <img src="${pageImages[i]}" alt="Character Image" draggable="false">
                                </div>
                                <div class="text-container" id="text-container">
                                    <p>${clickableParagraphs[i]}</p>
                                </div>
                                
                            </div>`;
}

const texts = document.querySelectorAll('.hidden-meaning');
const hoverTexts = document.querySelectorAll('.story-span-text');

hoverTexts.forEach(text => {
    text.style.position = "relative";

});

texts.forEach(text => {
    text.style.visibility = "hidden";
    text.style.position = "absolute";
    text.style.top = "-90px";
    text.style.width = "250px";
    text.style.padding = "10px";
    text.style.fontWeight = "400";
    text.style.left = "0px";
    text.style.color = "white";
    text.style.borderRadius = "10px";
    text.style.fontSize = "15px";
    text.style.backgroundColor = "#422c33";
});


start.addEventListener('click', recordAudio);


function explorePage() {
    window.open("explore.html", "_self");
}

async function nextStep(value) {
    let fullStory = "";
    for (let index = 0; index < paragraphs.length; index++) {
        fullStory += paragraphs[index]
    }

    const jsonBody = {
        "story": fullStory,
        "additions": value
    }


    const response = await fetch(BASE_URL + 'expand_story', {
        method: 'POST',
        body: JSON.stringify(jsonBody),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseJson = await response.json();
    localStorage.removeItem("story");
    localStorage.setItem("story", JSON.stringify(responseJson));
    window.open("storybook.html", "_self");
}


function getPhrase() {
    const regex = /.*?(\.)(?=\s[A-Z])/;
    phrase = regex.exec(paragraphs[1])[0];
}

function setQuestion() {
    document.getElementById("qtext").innerHTML = questions.questions[questionNum].question;
    let choiceBtns = document.getElementById("choices");
    choiceBtns.innerHTML = "";
    document.getElementById("answerText").innerHTML = "";
    for (let m = 0; m < questions.questions[questionNum].options.length; m++) {
        choiceBtns.innerHTML += `<button onclick="checkQuestion('${questions.questions[questionNum].options[m]}')" id="choice${m + 1}">${questions.questions[questionNum].options[m]}</button>`;
    }
}

function setRecording() {
    document.getElementById("qtext").innerHTML = "Read and record the sentence below";
    document.getElementById("choices").remove();
    document.getElementById("answerContainer").remove();
    let phraseCont = document.getElementById("phrase");
    phraseCont.innerHTML = phrase;
    phraseCont.style.fontFamily = "Poppin";
    document.getElementById("recording-container").style.visibility = "visible";
}



function openQuiz(boolean) {
    questionNum = 0;
    let container = document.getElementById("quizContainer");
    let audioContainer = document.getElementById("recording-container");
    if (boolean) {
        container.style.visibility = "visible";
    }
    if (!boolean) {
        container.style.visibility = "hidden";
        audioContainer.style.visibility = "hidden";
    }
}

function openSteps(boolean) {
    let container = document.getElementById("stepsContainer");
    if (boolean) {
        container.style.visibility = "visible";
    }
    if (!boolean) {
        container.style.visibility = "hidden";
    }
}


function recordAudio() {

    async function getUserMedia(constraints) {
        if (window.navigator.mediaDevices) {
            return window.navigator.mediaDevices.getUserMedia(constraints);
        }
        let legacyApi =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
        if (legacyApi) {
            return new Promise(function (resolve, reject) {
                legacyApi.bind(window.navigator)(constraints, resolve, reject);
            });
        } else {
            alert("user api not supported");
        }
    }

    async function upload3(blobFile) {
        let filename = Math.floor(Date.now() / 1000) + '-recording.flac';
        let response = await fetch(
            `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${filename}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "audio/flac",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: blobFile,
            }
        );
        let result = await response.json();
        if (result.mediaLink) {
            sendAudioFile(filename);
            alert(
                `Success to upload ${filename}. You can access it to ${result.mediaLink}`
            );
        } else {
            // window.open("errorpage.html", "_self");
            console.log("Not sent")
        }

    }


    function oauthSignIn() {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        form.setAttribute("method", "GET"); // Send as a GET request.
        form.setAttribute("action", oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {
            client_id: clientID,
            redirect_uri: "http://localhost:5000/",
            response_type: "token",
            scope: "https://www.googleapis.com/auth/devstorage.read_write",
            include_granted_scopes: "true",
            state: "pass-through value",
        };

        localStorage.setItem("paramsJSON", params[1]);
        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", p);
            input.setAttribute("value", params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }


    async function sendAudioFile(fileUrl) {
        const jsonBody = {
            "url": fileUrl,
            "text": phrase
        }

        const response = await fetch(BASE_URL + 'compare_audio', {
            method: 'POST',
            body: JSON.stringify(jsonBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseJson = await response.json();
        document.getElementById("similarity-score").style.visibility = "visible";
        let similarity = Math.round(responseJson.similarity * 100);
        document.getElementById("similarity").innerHTML = similarity + " %";
    };

    function handlerFunction(stream) {
        recorder = new MediaRecorder(stream);
        recorder.start();
        let recordingtxt = document.getElementById("recordingtxt");
        recordingtxt.innerHTML = "Recording..."
        setTimeout(() => {
            recorder.stop();
            recordingtxt.innerHTML = "Done!"
        }, 10000);
        recorder.ondataavailable = async (e) => {
            dataArray.push(e.data);
            if (recorder.state == "inactive") {
                let blob = new Blob(dataArray, { type: "audio/flac" });
                document.getElementById("newAudio").src = URL.createObjectURL(blob);
                const myFile = new File([blob], 'audio.flac', {
                    type: blob.type,
                });
                if (accessToken == null) {
                    oauthSignIn();
                }
                else {
                    upload3(blob);
                }
            }
        };

    }

    function startusingBrowserMicrophone(boolean) {
        getUserMedia({ audio: boolean }).then((stream) => {
            handlerFunction(stream);
        });
    }

    startusingBrowserMicrophone(true);
}



function plusPage(n) {
    showPage(pageIndex += n);
}

function checkQuestion(answer) {
    let qAnswer = questions.questions[questionNum].answer;
    let checkText = document.getElementById("answerText");

    if (answer == qAnswer) {
        checkText.style.color = "rgb(0, 212, 0)";
        checkText.innerHTML = "Correct!!!";
        document.getElementById("imgCorrect").style.visibility = "visible";
        questionNum++;
    } else {
        checkText.style.color = "red";
        checkText.innerHTML = "Incorrect. The correct answer is: " + qAnswer;
        questionNum++;
    }


    setTimeout(() => {
        if (questionNum == questions.questions.length) {
            document.getElementById("imgCorrect").style.visibility = "hidden";
            setRecording();
        } else {
            document.getElementById("imgCorrect").style.visibility = "hidden";
            setQuestion();
        }
    }, 2500);
}

function showPage(n) {
    let i;
    let pages = document.getElementsByClassName("page");
    if (n > pages.length) { pageIndex = 1 }
    if (n < 1) { pageIndex = pages.length }
    for (i = 0; i < pages.length; i++) {
        pages[i].style.display = "none";
    }
    pages[pageIndex - 1].style.display = "flex";

}

function showOptions() {
    clickNum += 1;
    if (clickNum % 2 == 0) {
        moreAction.style.visibility = "hidden"
    }
    else {
        moreAction.style.visibility = "visible"
    }
}



function getMeaning(e, word) {
    const texts = document.querySelectorAll('.text-meaning');

    texts.forEach(text => {
        text.style.visibility = "hidden";
    });
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

        .then((result) => dataProcess(e, result.data, word));
}

const dataProcess = (event, res, w) => {
    let show = event.target.querySelector('span');
    console.log(res.code);
    if (res.code == "ERR_BAD_REQUEST") {
        show.innerHTML = `Oh no! Cannot find the word ${w}`;
    } else {
        let definitions = res[0].meanings[0].definitions[0];
        show.innerHTML = definitions.definition;
    }
    show.style.visibility = "visible";
}

showPage(pageIndex);
setQuestion();
getPhrase();

