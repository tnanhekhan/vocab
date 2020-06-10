const firebaseService = require("./db/firebase-service");
const db = firebaseService.db;
const bucket = firebaseService.bucket;
const WORDS_COLLECTION_NAME = firebaseService.WORDS_COLLECTION_NAME;
const wordListsCollection = firebaseService.wordListsCollection;

module.exports.insertNewWord = (listId, word) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId).listCollections()
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

module.exports.getWord = (listId, wordId) => {
    return new Promise((resolve, reject) => {
        return wordListsCollection.doc(listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                wordListsCollection.doc(listId).collection(collectionId).doc(wordId).get()
                    .then(result => {
                        const word = result.data().word;
                        const uploadedImage = bucket.file(wordId);
                        uploadedImage.get()
                            .then(image => {
                                return resolve({word: word, hasImage: true, image: image[1].mediaLink});
                            })
                            .catch(() => {
                                return reject({word: word, hasImage: false});
                            });
                    });
            });
    });
}

module.exports.updateWord = (listId, wordId, word) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                wordListsCollection.doc(listId).collection(collectionId).doc(wordId)
                    .update({word: word, timestamp: Date.now()})
                    .then(() => {
                        return resolve(true);
                    })
            })
    });
}

module.exports.deleteWord = (listId, wordId) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId).listCollections()
            .then(collections => {
                const collectionId = collections[0].id;
                wordListsCollection.doc(listId).collection(collectionId).doc(wordId)
                    .delete()
                    .then(() => {
                        return resolve(true);
                    });
            });
    });
}

module.exports.saveImage = (wordId, buffer, mimeType) => {
    return new Promise(resolve => {
        const uploadedImage = bucket.file(wordId)
        uploadedImage.save(buffer, {
            public: true,
            contentType: mimeType
        }).then(() => {
            return resolve(true);
        });
    });
}