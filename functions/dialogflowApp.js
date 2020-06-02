const {
    dialogflow,
    HtmlResponse
} = require("actions-on-google");
const fb = require("./firebase");
const db = fb.firestore();
const app = dialogflow({debug: true});

const MAX_INCORRECT_GUESSES = 3;

let wordCollection = db.collection('wordlists').doc('wordlist').collection("wordCollection");

app.intent('Welcome', conv => {
    if (!conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS')) {
        conv.close('sorrie, dit apparaat kan deze app niet ondersteunen');
        return;
    }
    conv.ask('hi, welkom in de vocab app, ben je klaar?');
    conv.ask(new HtmlResponse({
        url: 'https://vocab-project.firebaseapp.com/',
        data: {
            event: 'WELCOME',
        },
    }));
});

let index = 0;
let woorden = [];

app.intent('Begin', conv => {
    return wordCollection.get().then(snapshot => {
        snapshot.forEach(woord => {
            woorden.push(woord.data().word);
        });
        conv.ask(woorden[index]);
        conv.ask(new HtmlResponse({
            data: {
                event: 'OEFENEN',
                woord: woorden[index]
            }
        }));
    });
});

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    if (index === woorden.length-1) {
        conv.close('Goed gedaan!');
        conv.ask(new HtmlResponse({
            data: {
                event: 'KLAAR'
            }
        }));
    } else {
        if (gesprokenWoord !== woorden[index]) {
            //herhaal
        } else {
            //verstuur ${index} naar db met ${conv.data.guess}
            index += 1;
        }

        conv.ask(woorden[index]);
        conv.ask(new HtmlResponse({
            data: {
                event: 'OEFENEN',
                woord: woorden[index]
            }
        }));
    }
});

app.intent('Fallback', conv => {
    conv.close('Er gaat wat mis');
});

app.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});

module.exports = app;