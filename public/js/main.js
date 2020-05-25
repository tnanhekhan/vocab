window.addEventListener('load',()=> {
    const callback = {
        onUpdate(data){
            displayWord(data.words);
        },
    };
    window.interactiveCanvas.ready(callback);
});

function displayWord(word){
    let displayWoord = document.getElementById('woord');
    displayWoord.innerHTML = word;
}
