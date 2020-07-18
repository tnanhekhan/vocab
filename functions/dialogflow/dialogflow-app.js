const {
    dialogflow,
    BasicCard,
    Image
} = require("actions-on-google");

const app = dialogflow({debug: true});
const intent = require('./intents-logic');

app.intent('Welcome', conv => {
    intent.welcome(conv);
});

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    return intent.woorden(conv,{gesprokenWoord}).then(result => {
        conv.ask(result.woord);
        conv.ask(new BasicCard({
            title: result.woord,
            image: new Image({
                url: result.plaatje
            })
        }));
    });
});

app.intent('spreuk', conv => {
    conv.ask('Leuk dat je komt oefenen. ' +
        'Wat is de geheime spreuk die je van je meester of juf hebt gekregen?' +
        ' Als je geen spreuk hebt, zeg dan ik heb geen spreuk');
});

app.intent('lijst spreuk', (conv, {spreuk}) => {
    return intent.lijstSpreuk(conv, {spreuk}).then( result => {
        conv.ask(`Hallo ${result.naam}. Zeg start om te beginnen`);
    });
});

app.intent('start', conv => {
    return intent.start(conv).then(result => {
        conv.ask(result.woord);
        conv.ask(new BasicCard({
            title: result.woord,
            image: new Image({
                url: result.plaatje
            }),
        }));
    }).catch(e => {console.error('error ',e)});
});

app.intent('Fallback', conv => {
    conv.ask('Zeg, "ja", als je wilt beginnen!');
});

module.exports = app;