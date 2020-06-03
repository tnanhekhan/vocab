const fb = require("../firebase");
const bucket = fb.storage().bucket();
const db = fb.firestore();

exports.getWords = (req, res) => {
    async function getImages(id) {
        try {
            return await bucket.file(id).get();
        } catch (e) {
            console.log(e);
        }
    }

    db.collection("wordlists").doc(req.params.listId).get()
        .then(snapshot => {
            const listName = snapshot.data().name;
            db.collection("wordlists").doc(req.params.listId).listCollections()
                .then(collections => {
                    const collectionId = collections[0].id;
                    db.collection("wordlists").doc(req.params.listId).collection(collectionId).get()
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

                                res.render("wordlists/words", {
                                    title: "CMS",
                                    dest: "wordlists",
                                    words: wordDocs,
                                    images: images,
                                    listId: req.params.listId,
                                    listName: listName
                                });
                            });
                        })
                });
        });
}

exports.updateWords = (req, res) => {
    function insertWords(req, res) {
        db.collection("wordlists").doc(req.params.listId)
            .update({name: req.body.listName})
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    function deleteWords(req, res) {
        db.collection("wordlists").doc(req.params.listId)
            .delete()
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    if ("save-wordlist" in req.body && req.body.listName.trim()) {
        insertWords(req, res);
    } else if ("delete-wordlist" in req.body) {
        deleteWords(req, res);
    } else {
        res.redirect("/cms/word-lists");
    }
}