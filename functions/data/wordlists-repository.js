const firebaseService = require("./db/firebase-service");
const db = firebaseService.db;
const WORDS_COLLECTION_NAME = firebaseService.WORDS_COLLECTION_NAME;
const wordListsCollection = firebaseService.wordListsCollection;

module.exports.getWordLists = () => {
    return new Promise((resolve, reject) => {
        return wordListsCollection.get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.data().name.length === 0) {
                        // Clears empty collection so word lists don't fill up with empty word lists
                        wordListsCollection.doc(doc.id).delete();
                    }
                });
                return resolve(snapshot.docs);
            })
            .catch(reason => {
                return reject(reason);
            });
    });
}

module.exports.getNewManualWordList = (now) => {
    return new Promise(resolve => {
        return wordListsCollection.add({name: "", created: now})
            .then(() => {
                wordListsCollection.get()
                    .then(snapshot => {
                        snapshot.docs.forEach(doc => {
                            if (doc.data().created === now) {
                                return resolve(doc);
                            }
                        });
                    })
            });
    });
}

module.exports.insertNewManualWordList = (listId, newListName) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId)
            .update({name: newListName})
            .then(() => {
                wordListsCollection.doc(listId).collection(WORDS_COLLECTION_NAME)
                    .add({word: "Voorbeeldwoord", timestamp: Date.now()})
                    .then(onSuccess => {
                        return resolve(onSuccess);
                    });
            })
    });
}

module.exports.deleteManualWordList = (listId) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId).delete()
            .then(onSuccess => {
                return resolve(onSuccess);
            });
    });
}

module.exports.insertUploadedWordList = (now, uploadedWordList) => {
    return new Promise(resolve => {
        return wordListsCollection.add({name: "Geüploade Lijst", created: now})
            .then(docRef => {
                let batch = db.batch();
                uploadedWordList.forEach(word => {
                    batch.set(wordListsCollection.doc(docRef.id).collection(WORDS_COLLECTION_NAME).doc(), word);
                })
                return {batch: batch, id: docRef.id};
            })
            .then(result => {
                result.batch.commit()
                    .then(() => {
                        return resolve(result.id);
                    });
            });
    });
}
