const {
    dialogflow,
    HtmlResponse
} = require("actions-on-google");

const app = dialogflow({debug: true});
const intent = require('./intents-logic');

app.intent('Welcome', conv => {
    intent.welcome(conv);
});

app.intent('Begin', conv => {
    return intent.begin(conv)
        .then(result => {
            conv.ask(result.woord);
            conv.ask(new HtmlResponse({
                data: {
                    event: result.event,
                    woord: result.woord,
                    plaatje: result.plaatje
                }
            }));
    });
});

app.intent('Woordjes', (conv, {gesprokenWoord}) => {
    return intent.woorden(conv,{gesprokenWoord}).then(result => {
        conv.ask(result.woord);
        conv.ask(new HtmlResponse({
            data: {
                event: result.event,
                woord: result.woord,
                plaatje: result.plaatje
            }
        }));
    });
});

app.intent('Fallback', conv => {
    conv.ask('Zeg, "ja", als je wilt beginnen!');
});

module.exports = app;