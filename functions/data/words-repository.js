const firebaseService = require("./db/firebase-service");
const bucket = firebaseService.bucket;
const wordListsCollection = firebaseService.wordListsCollection;

module.exports.getWords = (listId) => {
    async function getImages(id) {
        try {
            return await bucket.file(id).get();
        } catch (e) {
            console.log(e);
        }
    }

    return new Promise((resolve) => {
        return wordListsCollection.doc(listId).get()
            .then(snapshot => {
                const listName = snapshot.data().name;
                wordListsCollection.doc(listId).listCollections()
                    .then(collections => {
                        if (collections.length) {
                            const collectionId = collections[0].id;
                            wordListsCollection.doc(listId).collection(collectionId).get()
                                .then(snapshot => {
                                    return snapshot.docs;
                                })
                                .then(wordDocs => {
                                    const images = wordDocs.map(word => {
                                        return getImages(word.id);
                                    });

                                    Promise.all(images).then(result => {
                                        const filteredImages = result.filter(el => {
                                            return el != null;
                                        });

                                        const images = [];
                                        filteredImages.forEach(filteredImage => {
                                            images.push({id: filteredImage[1].name, url: filteredImage[1].mediaLink});
                                        });

                                        return resolve({words: wordDocs, images: images, listName: listName});
                                    });
                                });
                        } else {
                            return resolve(listName);
                        }
                    });
            });
    });
}

module.exports.insertWords = (listId, listName) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId)
            .update({name: listName})
            .then(onSuccess => {
                return resolve(onSuccess);
            });
    });
}

module.exports.deleteWords = (listId) => {
    return new Promise(resolve => {
        return wordListsCollection.doc(listId)
            .delete()
            .then(onSuccess => {
                return resolve(onSuccess);
            });
    });
}