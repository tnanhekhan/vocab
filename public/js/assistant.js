window.addEventListener('load',() => {
    initCreativeCanvas();
});

function initCreativeCanvas(){
    const callback = {
        onUpdate(data){
            updateCanvas(data);
        },
    };
    window.interactiveCanvas.ready(callback);
    //setCanvasHeaderHeight();
}


function setCanvasHeaderHeight(){
    window.interactiveCanvas.getHeaderHeightPx().then((height) => {

    });
}

function updateCanvas(data){
    if(data.event) {
        switch (data.event) {
            case 'OEFENEN':
                showWoord(data.woord);
                break;
            case 'WELCOME':
                showWoord('welkom');
                break;
        }
    }
}

function showWoord(woord){
    let displayWoord = document.getElementById('woord');
    displayWoord.innerHTML = woord;
}
