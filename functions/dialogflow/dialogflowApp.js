const {
    dialogflow,
    BasicCard,
    Image,
} = require("actions-on-google");

const app = dialogflow({debug: true});
const intent = require('./assets/intentsLogic');

app.intent('Welcome', conv => {
    intent.welcome(conv);
    conv.ask('•	Hi, welkom in de voicab app. Met mij kun je woordjes oefenen. Ik zeg een woord en ik wacht tot jij het' +
        ' woord herhaald hebt. Als jij het goed hebt herhaald gaan we door naar het volgende woord. Als je wilt oefenen ' +
        'zeg dan /ik wil oefenen. ');
});

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    return intent.woorden(conv, {gesprokenWoord})
        .then(result => {
            conv.ask(result.woord);
            conv.ask(new BasicCard({
                title: result.woord,
                image: new Image({
                    url: result.plaatje
                })
            }));
        })
        .catch(e => {
            console.error('error ', e);
        });
});

app.intent('spreuk', conv => {
    conv.ask('Leuk dat je komt oefenen. Wat is de geheime spreuk die je van je meester of juf hebt gekregen? Als je geen spreuk hebt zeg dan "ik heb geen spreuk".');
});

app.intent('lijst spreuk', (conv, {parameter}) => {
    return intent.lijstSpreuk(conv, {parameter})
        .then(result => {
            conv.ask(`Hallo ${result.naam}. Zeg start om te beginnen.`);
        });
});

app.intent('start', conv => {
    return intent.start(conv)
        .then(result => {
            conv.ask(result.woord);
            conv.ask(new BasicCard({
                title: result.woord,
                image: new Image({
                    url: result.plaatje
                }),
            }));
        })
        .catch(e => {
            console.error('error ', e)
        });
});

app.intent('geen spreuk', conv => {
    conv.ask('Iedere oefening begint met een spreuk. Je kunt je meester of juf een spreuk laten maken op "voicab.nl".' +
        'Als je het nu wilt proberen is de oefenspreuk "appel banaan"');
});

app.intent('uitleg', (conv) => {
    conv.ask('Ik ben een robot. Je kunt samen met mij woordjes oefenen.');
});

app.intent('stop', (conv) => {
    conv.ask('Je wilt stoppen! tot de volgende keer!');
});

app.intent('Fallback', (conv) => {
    conv.ask('Sorrie, ik begreep dat niet. ');
});

app.intent('spreuk - fallback', (conv) => {
    conv.ask('de spreuk was niet goed.');
});

module.exports = app;