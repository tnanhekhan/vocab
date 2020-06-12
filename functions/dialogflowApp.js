const {
    dialogflow,
    HtmlResponse
} = require("actions-on-google");
const fbConfig = require("./firebase");
const db = fbConfig.firestore();
const bucket = fbConfig.storage().bucket();

const app = dialogflow({debug: true});

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

app.intent('Welcome', conv => {
    if (!conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS')) {
        conv.close('sorrie, dit apparaat kan deze app niet ondersteunen');
        return;
    }
    conv.ask('hi, welkom in de vocab app, ben je klaar?');
    conv.ask(new HtmlResponse({
        url: 'https://vocab-project.web.app/',
        data: {
            event: 'WELCOME',
        },
    }));
});

let index = 0;
let woorden = [];

app.intent('Begin', conv => {
    let data = [];
    return wordCollection.get().then(snapshot => {
        snapshot.forEach(woord => {
            data.push(woord)
        });
        woorden = data.map(woord => {
            return {
                id: woord.id,
                woord: woord.data().word
            }
        });
        return bucket.file(woorden[index].id).get()
            .then(result => {
                conv.ask(woorden[index].woord);
                conv.ask(new HtmlResponse({
                    data: {
                        event: 'OEFENEN',
                        woord: woorden[index].woord,
                        plaatje: result[1].mediaLink
                    }
                }));
            })
            .catch(e => {
                conv.ask(woorden[index].woord);
                conv.ask(new HtmlResponse({
                    data: {
                        event: 'OEFENEN',
                        woord: woorden[index].woord
                    }
                }));
            });
    });
});

function sendProgress(completedWords, difficultWords, woordenlijst){
    const progress = db.collection('progression').doc('J0Ijqla8aZG6HC9CRIYp')
        .update({
            wordsCompleted: completedWords,
            stdnt: 'n9lFtuniXq9yR4LpdN3f',
            moeilijkeWoorden: difficultWords,
            woordenlijst: woordenlijst
        });
}

const moeilijkeWoorden = [];
let incorrect_guesses = 0;
let woord = '';

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    console.log('index', index, ' woord ', woorden.length-1)
    if (index === woorden.length-1) {
        conv.ask('Goed gedaan!');
        sendProgress(20,moeilijkeWoorden, 'list one');
        conv.close(new HtmlResponse({
            data: {
                event: 'KLAAR'
            }
        }));
    } else {
        if ((gesprokenWoord.toLowerCase() !== woorden[index].woord.toLowerCase())&&(incorrect_guesses < 3)) {
            incorrect_guesses += 1;
            woord = {word: woorden[index].woord, tries: incorrect_guesses};
        } else {
            console.log('hier', woorden[index].woord , ' index ', index);
            if(woord !== ""){
                moeilijkeWoorden.push(woord);
            }
            woord = "";
            incorrect_guesses = 0;
            index += 1;
        }
        return bucket.file(woorden[index].id).get()
            .then(result => {
                conv.ask(woorden[index].woord);
                conv.ask(new HtmlResponse({
                    data: {
                        event: 'OEFENEN',
                        woord: woorden[index].woord,
                        plaatje: result[1].mediaLink
                    }
                }));
            }).catch(e => {
                conv.ask(woorden[index].woord);
                conv.ask(new HtmlResponse({
                    data: {
                        event: 'OEFENEN',
                        woord: woorden[index].woord
                    }
                }));
            });
    }
});

app.intent('Fallback', conv => {
    conv.close('Er gaat wat mis');
});

module.exports = app;