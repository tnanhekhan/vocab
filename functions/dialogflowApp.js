const {
    dialogflow,
    HtmlResponse
} = require("actions-on-google");
const fbConfig = require("./firebase");
const db = fbConfig.firestore();
const bucket = fbConfig.storage().bucket();

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

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    if (index === woorden.length-1) {
        conv.ask('Goed gedaan!');
        conv.ask(new HtmlResponse({
            data: {
                event: 'KLAAR'
            }
        }));
        conv.close();
    } else {
        if (gesprokenWoord.toLowerCase() !== woorden[index].woord.toLowerCase()) {
            //herhaal
        } else {
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

app.catch((conv, error) => {
    console.error(error);
    conv.ask('Er gaat iets mis, zou je dat kunnen herhalen?');
});

module.exports = app;