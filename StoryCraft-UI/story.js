let story = JSON.parse(localStorage.getItem("story"));
let pageImages = story.images.reverse();
let paragraphs = story.parts.reverse();
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

for (let i = 0; i < pageCount; i++) {
    var pageDiv = document.getElementById("page-container");
    pageDiv.innerHTML += `<div id="page-${(i * 2) - 1}" class="page" data-dir="r">
                        <div class="page-trigger"></div>
                        <div class="page-content">
                            <div class="page-image">
                                <img src="${pageImages[i]}"
                                    alt="Page Image">
                            </div>
                            <p>${clickableParagraphs[i]}</p>
                        </div>
                    </div>
                    <div id="page-${(i * 2)}" class="page" data-dir="r">
                        <div class="page-trigger"></div>
                        <div class="page-content"></div>
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
var coverIndex = 1;
var pageIndex = 0;
var num = $('.page').length;
var zIndexSet = '<style>';

for (i = 1; i <= num; i++) {
    zIndexSet += '[data-dir="r"]#page-' + i + '{z-index: ' + (num - i + 1) + '}';
};
zIndexSet += '</style>';
$('.book').prepend(zIndexSet);
$(function () {
    $('.page-trigger').on('click', function () {
        var e = $(this).parent('.page')
        flip(e.attr('id'), e)
    });


    $('.cover').on('click', function () {
        var e = $(this)
        flip(e.attr('id'), e)
    });

});

function flip(type, $page) {
    var isEnabled = true

    if (isEnabled) {
        isEnabled = false;

        if (type.indexOf('cover') != -1) {
            coverIndex += 1;

            setTimeout(function () {
                $('.book-bg').css('z-index', '2')
            }, 800);
        }



        if ($page.attr('data-dir') == "r") {
            $page.attr('data-dir', 'l').css('transform', 'rotateY(-180deg)');
            $page.next().attr('data-dir', 'l').css('transform', 'rotateY(0deg)');
            if (type == 'page') { pageIndex += 2 }
            if (type == 'cover') { coverIndex += 1 }
            console.log('pageIndex ' + pageIndex + ' coverIndex ' + coverIndex);
            setTimeout(function () {
                isEnabled = true
            }, 800);
        } else if ($page.attr('data-dir') == "l") {
            // debugger
            $page.attr('data-dir', 'r').css('transform', 'rotateY(180deg)');
            $page.prev().attr('data-dir', 'r').css('transform', 'rotateY(0deg)');
            if (type == 'page') { pageIndex -= 2 }
            if (type == 'cover') { coverIndex -= 1 }
            console.log('pageIndex ' + pageIndex + ' coverIndex ' + coverIndex);
            setTimeout(function () {
                isEnabled = true
            }, 800);

        };

    };

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

function downloadPDF() {
    let json = localStorage.getItem("story");
    let story = JSON.parse(json);

    var containerDiv = document.createElement("div");
    containerDiv.id = "containerDiv";

    var doc = new jsPDF({
        orientation: "landscape",
    });

    let count = story.parts.length;
    for (let i = 0; i < count; i++) {
        // var img = new Image();
        // img.crossOrigin = "";
        // img.src = "images/reading.png";
        // img.onload = function () {
        //     doc.addImage(this, 10, 10);
        //     doc.save('yourstory.pdf')
        // };
        doc.text(story.parts[i], 10, 10 + (i * 6));
    }
    doc.save('yourstory.pdf');
}

var x = document.getElementById("myAudio");

function playAudio() {
    x.play();
}

function pauseAudio() {
    x.pause();
  }