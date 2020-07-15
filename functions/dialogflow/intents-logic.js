const {
    dialogflow
} = require("actions-on-google");
const fbConfig = require("../firebase");
const db = fbConfig.firestore();
const bucket = fbConfig.storage().bucket();

let incorrect_guesses = 0;
const moeilijkeWoorden = [];

async function fetchWoorden(){
    let data = [];
    let getLijst = await db.collection('students').doc('8Bnz4LbO0ywimt0oGjY5').get();
    let wordCollection = db.collection('wordlists').doc(getLijst.data().woordenlijst).collection("wordCollection");
    let snapshot = await wordCollection.get();
    snapshot.forEach(woord => {
        data.push(woord);
    });
    let woorden = data.map(woord => {
        return {
            id: woord.id,
            woord: woord.data().word
        }
    });
    return woorden;
}

async function fetchImages(imageID) {
    let result = await bucket.file(imageID).get();
    return result[1].mediaLink;
}

async function sendProgress(completedWords, difficultWords, woordenlijst) {
    const studentProgressie = db.collection('progression').doc('J0Ijqla8aZG6HC9CRIYp');
    let geoefend = await studentProgressie.get();
    geoefend = geoefend.data().woordenGeoefend + completedWords;
    console.log('aantalwoorden ',geoefend);
        studentProgressie.get().update({
            woordenGeoefend: geoefend,
            student: '8Bnz4LbO0ywimt0oGjY5',
            moeilijkeWoorden: difficultWords,
            woordenlijst: woordenlijst
        });
}

exports.welcome = conv => {
    if (!conv.surface.capabilities.has('actions.capability.INTERACTIVE_CANVAS')) {
        conv.close('sorrie, dit apparaat understeund deze app niet!');
        return;
    }
    conv.ask('hi, welkom in de vocab app, ben je klaar?');
    conv.data.index = 0;
};

exports.begin = conv => {
    conv.data.woordenlijst = [];
    return fetchWoorden().then(woorden => {
        conv.data.woordenlijst = woorden;
        return fetchImages(conv.data.woordenlijst[conv.data.index].id).then(result => {
            return {woord: conv.data.woordenlijst[conv.data.index].woord, plaatje: result, event: 'OEFENEN'};
        });
    });
};

exports.woorden = (conv, {gesprokenWoord}) => {
    const aantalWoorden = conv.data.woordenlijst.length - 1;
    let laatsteWoord = conv.data.woordenlijst[conv.data.woordenlijst.length - 1].woord.toLowerCase();
    let value = '';

    if (gesprokenWoord === laatsteWoord) {
        sendProgress(aantalWoorden, moeilijkeWoorden, 'list two');
        return value = new Promise((resolve, reject) => {
            resolve({woord: 'goed gedaan! tot de volgende keer!', event: 'KLAAR', plaatje: null});
        });
    } else {
        if ((gesprokenWoord.toLowerCase() !== conv.data.woordenlijst[conv.data.index].woord.toLowerCase()) && (incorrect_guesses < 1)) {
            incorrect_guesses += 1;
            conv.data.woord = {word: conv.data.woordenlijst[conv.data.index].woord, tries: incorrect_guesses};
            conv.ask('Helaas, dat is niet goed! Laten we het nog een keer proberen!')
        } else if (conv.data.index !== aantalWoorden) {
            if (conv.data.woord !== "") {
                moeilijkeWoorden.push(conv.data.woord);
            }
            conv.data.woord = "";
            incorrect_guesses = 0;
            conv.data.index += 1;
            conv.ask('Dat is goed!');
        }
        return fetchImages(conv.data.woordenlijst[conv.data.index].id)
            .then(result => {
                return {woord: conv.data.woordenlijst[conv.data.index].woord, plaatje: result, event: 'OEFENEN'};
            });
    }
};