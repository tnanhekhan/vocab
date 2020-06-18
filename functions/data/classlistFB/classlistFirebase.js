const firebaseService = require("../db/firebase-service");
const db = firebaseService.db;
const classCollection = firebaseService.classesCollection;

module.exports.insertNewClass = (listId, word) => {
    return new Promise(resolve => {
        return classCollection.doc(listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                wordListsCollection.doc(listId).collection(collectionId)
                    .add({word: word, timestamp: Date.now()})
                    .then(onSuccess => {
                        return resolve(onSuccess);
                    });
            });
    });
}