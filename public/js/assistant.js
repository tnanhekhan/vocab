window.addEventListener('load',() => {
    initCreativeCanvas();
});

function initCreativeCanvas() {
    const callback = {
        onUpdate(data){
            updateCanvas(data);
        },
    };
    window.interactiveCanvas.ready(callback);
    // setCanvasHeaderHeight();
}


function setCanvasHeaderHeight() {
    interactiveCanvas.getHeaderHeightPx()
        .then((headerHeight) => {
            // document.getElementsByTagName("BODY")[0].style.padding = `${headerHeight}px 0px 0px 0px`;
    });
}

function updateCanvas(data) {
    if(data.event) {
        switch (data.event) {
            case 'OEFENEN':
                //Dit wordt elke keer uitgevoerd, dat moet maar 1 keer
                displayWoordjes();
                woordjes(data);
                break;
            case 'WELCOME':
                showWelcome();
                break;
            case 'KLAAR':
                showGoodbye();
                break;
        }
    }
}

function showWelcome() {
    let welkom = document.getElementById('woordjes');
    welkom.innerHTML = `<h1 id="greeting">Welkom!</h1>`;
}

function showGoodbye() {
    let groet = document.getElementById('woordjes');
    groet.innerHTML = '';
    groet.innerHTML = `<h1 id="goodbye">Totziens!</h1>`;
}

function displayWoordjes(){
    let woordjes = document.getElementById('woordjes');
    woordjes.innerHTML = '';
    woordjes.innerHTML =
        `<div id="word-container"></div>
        <div id="image-container"></div>`;
}

function woordjes(data) {
    let wordContainer = document.getElementById('word-container');
    let imageContainer = document.getElementById('image-container');
    if(data.plaatje !== undefined){
        imageContainer.innerHTML = `<img src="${data.plaatje}">`;
    } else {
        imageContainer.innerHTML = '';
    }

    wordContainer.innerHTML = `<h1>${data.woord}</h1>`;
}

