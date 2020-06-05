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

/*function turnOfScreens(screens){
    screens.forEach(screen => {
        document.getElementById(screen).style.display = "none";
    });
}*/

function showWelcome() {
    let woordjes = document.getElementById('woordjes');
    woordjes.innerHTML = `<h1 id="greeting">Welcome</h1>`;
}

/*function showGoodbye() {
    turnOfScreens(['welcome','woordjes']);
    const goodbye = document.querySelector("goodbye");
    goodbye.innerHTML = `<h1>Tot de volgende keer!</h1>`;
}*/

function display(screen) {
    document.getElementById(screen).style.display = "block";
}

function hide(screen) {
    document.getElementById(screen).style.display = "none";
}

function displayWoordjes(){
    let woordjes = document.getElementById('woordjes');
    woordjes.innerHTML = '';
    woordjes.innerHTML =
        `<h1 id="woord"></h1>
        <div id="image-container"></div>`;
}

function woordjes(data) {
    let word = document.getElementById('woord');
    let imageContainer = document.getElementById('image-container');
    if(data.plaatje !== undefined){
        imageContainer.innerHTML = `<img id="image" src="${data.plaatje}">`;
    } else {
        imageContainer.innerHTML = '';
    }
    word.innerHTML = data.woord;
}

