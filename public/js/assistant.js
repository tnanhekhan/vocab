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
    if(data) {
        switch(data.test){
            case "woordjes":
                showWoord(data.woord);
                break;
        }

    }
}

function showWoord(woord){
    let displayWoord = document.getElementById('woord');
    displayWoord.innerHTML = woord;
}
