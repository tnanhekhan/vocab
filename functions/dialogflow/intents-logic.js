const {
    HtmlResponse
} = require("actions-on-google");
const fbConfig = require("../firebase");
const db = fbConfig.firestore();
const bucket = fbConfig.storage().bucket();


let index = 0;
let incorrect_guesses = 0;
let woord = '';
let woordenlijst = [];
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

        studentProgressie.get().update({
            woordenGeoefend: geoefend,
            student: '8Bnz4LbO0ywimt0oGjY5',
            moeilijkeWoorden: difficultWords,
            woordenlijst: woordenlijst
        });
}

exports.welcome = conv => {
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
};

exports.begin = () => {
    return fetchWoorden().then(woorden => {
        woordenlijst = woorden;
        return fetchImages(woordenlijst[index].id).then(result => {
            return {woord: woordenlijst[index].woord, plaatje: result, event: 'OEFENEN'};
        });
    });
};

exports.woorden = (conv, {gesprokenWoord}) => {
    const aantalWoorden = woordenlijst.length - 1;
    let laatsteWoord = woordenlijst[woordenlijst.length - 1].woord.toLowerCase();
    let value = '';

    if (gesprokenWoord === laatsteWoord) {
        sendProgress(aantalWoorden, moeilijkeWoorden, 'list two');
        return value = new Promise((resolve, reject) => {
            resolve({woord: 'goed gedaan!', event: 'KLAAR', plaatje: null});
        });
    } else {
        if ((gesprokenWoord.toLowerCase() !== woordenlijst[index].woord.toLowerCase()) && (incorrect_guesses < 3)) {
            incorrect_guesses += 1;
            woord = {word: woordenlijst[index].woord, tries: incorrect_guesses};
        } else if (index !== aantalWoorden) {
            if (woord !== "") {
                moeilijkeWoorden.push(woord);
            }
            woord = "";
            incorrect_guesses = 0;
            index += 1;
        }
        return fetchImages(woordenlijst[index].id)
            .then(result => {
                return {woord: woordenlijst[index].woord, plaatje: result, event: 'OEFENEN'};
            });
    }
};