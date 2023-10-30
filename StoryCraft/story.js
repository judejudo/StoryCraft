let story = JSON.parse(localStorage.getItem("story"));
let pageImages = story.images.reverse();
let paragraphs = story.parts.reverse();
let clickNum = 0;
console.log(paragraphs)
let clickableParagraphs = [];
for (let i = 0; i < paragraphs.length; i++) {
    let splits = paragraphs[i].match(/\b(\w+\W+)/g);
    let html = `<p>`;
    for (let j = 0; j < splits.length; j++) {
        html += `<span class=\"story-span-text\" onClick=getMeaning(event,'${splits[j].trim()}')>${splits[j]} <span class=\"text-meaning hidden-meaning\">pipi</span></span>`;
    }
    html += `</p>`;
    clickableParagraphs.push(html);
}

let pageCount = story.images.length;
var flipbookEL = document.getElementById('flipbook');
var moreAction = document.getElementById('moreOptions');
for (let i = 0; i < pageCount; i++) {
    flipbookEL.innerHTML += `<div class="page">
                                <div class="image-container">
                                    <img src="${pageImages[i]}" alt="Character Image" draggable="false">
                                </div>
                                <div class="text-container">
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
    text.style.width = "100px";
    text.style.padding = "10px";
    text.style.fontWeight = "400";
    text.style.left = "0px";
    text.style.color = "white";
    text.style.borderRadius = "10px";
    text.style.fontSize = "15px";
    text.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
});

let audioIN = { audio: true }

let start = document.getElementById("startRecording");

start.addEventListener('click', recordAudio);

function openQuiz(boolean) {
    let container = document.getElementById("quizContainer");
    if (boolean) {
        container.style.visibility = "visible";
    }
    if (!boolean) {
        container.style.visibility = "hidden";
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

    // let audioBtn = document.getElementById("newAudio");

    let dataArray = [];
    let recorder;

    var config = {
        apiKey: "AIzaSyDiPkM01PcS84zFdsbCrXkMbPWDbX8bHqM",
        authDomain: "a2sv-hackathon.firebaseapp.com",
        projectId: "a2sv-hackathon",
        storageBucket: "a2sv-hackathon.appspot.com",
        messagingSenderId: "335557285236",
        appId: "1:335557285236:web:95de9a7b59613041ef8821",
        measurementId: "G-TJ192BJEB9"
    };
    firebase.initializeApp(config);

    const bucketName = "sound_buckets";
    const clientID = "1090577769307-lhl8kgfugamtlnocet53hhffr1rfb574.apps.googleusercontent.com";
    const accessToken = "ya29.a0AfB_byA_HwI_WjkOznsD1GmrQ7EXuZitGa83Me9y-q1RfI-SzhWyZ8wkRrM1LCVjBjmsNEqbf6vupiOSnJ8P0dtxt6B6QEXXIWCHb8nt8zj5hVUDSs0h6jzk7Tl0TkC8x5BnD1xxG5dSRp2Itz_IGMxMqzRL80TiuAaCgYKAb8SARESFQGOcNnC12iAJtlX3vIz6jPYmqfsbQ0169";
    // const accessToken = null;
    // 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
    var form = document.createElement("form");

    async function upload3(blobFile) {
        let filename = 'recording.flac';
        console.log(filename);
        console.log(filename);
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
            alert(`Failed to upload ${filename}`);
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
            redirect_uri: "http://localhost/StoryBook/hellonearth.html/",
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

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
        // window.location.href = "http://localhost/StoryCraft/hellonearth.html"
    }

    async function uploadAudio2(blobFile) {
        let filename = Math.floor(Date.now() / 1000) + '-recording.flac';
        let response = await fetch(
            `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${filename}`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "audio/flac",
                    Authorization: `Bearer ${accessToken}`
                },
                body: blobFile
            });
        let result = await response.json();
        if (result.mediaLink) {
            alert(
                `Success to upload ${filename}. You can access it to ${result.mediaLink}`
            );
        } else {
            alert(`Failed to upload ${filename}`);
        }
    }

    async function uploadAudio(blobAudio) {
        var storageRef = firebase.storage().ref();
        var filename = Math.floor(Date.now() / 1000) + '-recording.flac';

        var uploadTask = storageRef.child(filename).put(blobAudio);

        uploadTask.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    // sendAudioFile(downloadURL);
                });
            }
        );
    }
    const BASE_URL = 'http://127.0.0.1:5000/';
    async function sendAudioFile(fileUrl) {
        const jsonBody = {
            "url": fileUrl,
            "text": "lola, lola, lola"
        }

        console.log(JSON.stringify(jsonBody));

        const response = await fetch(BASE_URL + 'compare_audio', {
            method: 'POST',
            body: JSON.stringify(jsonBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    function handlerFunction(stream) {
        recorder = new MediaRecorder(stream);
        recorder.start();
        let recordingtxt = document.getElementById("recordingtxt");
        recordingtxt.innerHTML = "Recording..."
        setTimeout(() => {
            recorder.stop();
            recordingtxt.innerHTML = "Done!"
        }, 7000);
        recorder.ondataavailable = async (e) => {
            dataArray.push(e.data);
            if (recorder.state == "inactive") {
                let blob = new Blob(dataArray, { type: "audio/flac" });
                console.log(blob);
                document.getElementById("newAudio").src = URL.createObjectURL(blob);
                const myFile = new File([blob], 'audio.flac', {
                    type: blob.type,
                });
                // if (accessToken == null) {
                //     oauthSignIn();
                // }
                // else {
                    // upload3(blob);
                    sendAudioFile("output.mp3")
                // }
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

let pageIndex = 1;
showPage(pageIndex)

function plusPage(n) {
    showPage(pageIndex += n);
}

function checkQuestion(answer) {
    console.log(answer);
    var qtext = document.getElementById("qtext");
    var leftChoice = document.getElementById("leftChoice");
    var rightChoice = document.getElementById("rightChoice");

    //check if answer is correct
    qtext.innerHTML = "Where is Tim from?";
    leftChoice.innerHTML = "Home";
    rightChoice.innerHTML = "Somewhere";
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

$(".option").click(function () {
    $(".option").removeClass("active");
    $(this).addClass("active");
});

$(".option-bottom").click(function () {
    $(".option-bottom").removeClass("active");
    $(this).addClass("active");
});

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
