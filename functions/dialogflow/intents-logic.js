const data = require('./fetchData');

exports.welcome = conv => {
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
        conv.close('sorrie, dit apparaat understeund deze app niet!');
        return;
    }
    conv.data.index = 0;
    conv.data.woordenlijst = [];
    conv.ask('hi, welkom in de vocab app? Met mij kun je woordjes oefenen. Als je uitleg wilt, zeg dan / ik wil uitleg.\n' +
        'Als je wilt oefenen zeg dan /ik wil oefenen');
};

exports.lijstSpreuk = (conv, {spreuk}) => {
    return data.fetchList(spreuk).then(result => {
        return data.fetchName(result[0].student).then(name => {
            return data.fetchWoorden(result[0].list).then(woorden => {
                conv.data.woordenlijst = woorden;
                return {naam: name};
            });
        });
    });
};

exports.start = (conv) => {
    return data.fetchImages(conv.data.woordenlijst[conv.data.index].id).then(result => {
        return {woord: conv.data.woordenlijst[conv.data.index].woord, plaatje: result};
    });
};

exports.woorden = (conv, {gesprokenWoord}) => {
    const moeilijkeWoorden = [];
    const aantalWoorden = conv.data.woordenlijst.length - 1;
    let laatsteWoord = conv.data.woordenlijst[conv.data.woordenlijst.length - 1].woord.toLowerCase();
    conv.data.incorrect_guesses = 0;

    if (gesprokenWoord === laatsteWoord) {
        data.sendProgress(aantalWoorden, moeilijkeWoorden, 'list two');
    } else {
        if ((gesprokenWoord.toLowerCase() !== conv.data.woordenlijst[conv.data.index].woord.toLowerCase()) && (conv.data.incorrect_guesses < 1)) {
            conv.data.incorrect_guesses += 1;
            conv.data.woord = {word: conv.data.woordenlijst[conv.data.index], tries: conv.data.incorrect_guesses};
            conv.ask('Helaas, dat is niet goed! Laten we het nog een keer proberen!')
        } else if (conv.data.index !== aantalWoorden) {
            if (conv.data.woord !== "") {
                moeilijkeWoorden.push(conv.data.woord);
            }
            conv.data.woord = "";
            conv.data.incorrect_guesses = 0;
            conv.data.index += 1;
            conv.ask('Goedzo, volgende vraag!');
        }
        return data.fetchImages(conv.data.woordenlijst[conv.data.index].id)
            .then(result => {
                return {woord: conv.data.woordenlijst[conv.data.index].woord, plaatje: result};
            });
    }
};