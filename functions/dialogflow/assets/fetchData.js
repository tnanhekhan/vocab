const fbConfig = require("../../firebase");
const db = fbConfig.firestore();
const bucket = fbConfig.storage().bucket();

async function fetchList(spreuk) {
    let getLijst = await db.collection('spells').where('spell', '==', spreuk).get();
    let result = getLijst.docs.map(doc => {
        return {
            list: doc.data().wordlist,
            student: doc.data().student,
        }
    });
    return result;
}

async function fetchWoorden(listID) {
    let data = [];
    let wordCollection = db.collection('wordlists').doc(listID).collection("wordcollection");
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

async function fetchName(studentID) {
    let dataName = await db.collection('students').doc(studentID).get();
    let name = {naam: dataName.data().voornaam + ' ' + dataName.data().achternaam};
    return name.naam;
}

async function sendProgress(completedWords, difficultWords, woordenlijst, student) {
    const studentProgressie = db.collection('progression').where('student', '==', student);
    let geoefend = await studentProgressie.get();
    let data = geoefend.docs.map(info => {
        return {
            aantalWoorden: info.data().woordenGeoefend
        }
    });
    console.log('woorden ', data[0].aantalWoorden, ' progressie ', studentProgressie);
    geoefend = data[0].aantalWoorden + completedWords;
    studentProgressie.get().update({
        woordenGeoefend: geoefend,
        student: student,
        moeilijkeWoorden: difficultWords,
        woordenlijst: woordenlijst
    });
}

module.exports.fetchList = fetchList;
module.exports.fetchWoorden = fetchWoorden;
module.exports.fetchImages = fetchImages;
module.exports.fetchName = fetchName;
module.exports.sendProgress = sendProgress;