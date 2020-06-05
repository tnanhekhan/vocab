const fb = require("../firebase");
const xlsx = require('xlsx');
const db = fb.firestore();

// Routes to the all the word lists
exports.getWordLists = (req, res) => {
    db.collection('wordlists').get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                if (doc.data().name.length === 0) {
                    db.collection("wordlists").doc(doc.id).delete();
                }
            });
            return snapshot.docs;
        })
        .then(wordLists => {
            res.render("wordlists/wordlists", {title: "CMS", dest: "wordlists", wordLists: wordLists});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
}

// Routes to the the word list choice screen between manual or load a file
exports.getAddWordListModal = (req, res) => {
    res.render("wordlists/wordlist-add-choice", {title: "CMS", dest: "wordlists"});
}

// Routes to the the manual word list screen
exports.getManualAddWordList = (req, res) => {
    const now = Date.now();
    db.collection("wordlists").add({name: "", created: now})
        .then(() => {
            db.collection("wordlists").get()
                .then(snapshot => {
                    return snapshot.docs;
                })
                .then(wordlists => {
                    wordlists.forEach(wordlist => {
                        if (wordlist.data().created === now) {
                            res.render("wordlists/words", {
                                title: "CMS",
                                dest: "wordlists",
                                words: [],
                                listId: wordlist.id,
                                listName: ""
                            });
                        }
                    })
                });
        });
};

exports.getUploadedAddWordList = (req, res) => {
    const {
        mimetype,
        buffer,
    } = req.files[0]
    const workBook = xlsx.read(buffer, {type: "buffer"});
    const worksheetArray = xlsx.utils.sheet_to_json(workBook.Sheets[Object.keys(workBook.Sheets)]);
    const uploadedWordList = worksheetArray.map(field => {
        return {word: field[Object.keys(field)], timestamp: Date.now()};
    });
    uploadedWordList.unshift({word: Object.keys(worksheetArray[0])[0], timestamp: uploadedWordList[0].timestamp});

    db.collection("wordlists").add({name: "Geüploade Lijst", created: Date.now()})
        .then(docRef => {
            let batch = db.batch();
            uploadedWordList.forEach(word => {
                batch.set(db.collection("wordlists").doc(docRef.id).collection("wordcollection").doc(), word);
            });
            return {batch: batch, id: docRef.id};
        })
        .then(result => {
            result.batch.commit()
                .then(() => {
                    res.redirect(`/cms/word-lists/${result.id}`);
                });
        });
}

// Redirect logic when creating a word list manually
exports.updateManualAddWordList = (req, res) => {
    function insertManualWordList(req, res) {
        db.collection("wordlists").doc(req.body.listId)
            .update({name: req.body.listName})
            .then(() => {
                db.collection("wordlists").doc(req.body.listId).collection("wordcollection")
                    .add({word: "Voorbeeldwoord", timestamp: Date.now()})
                    .then(() => {
                        res.redirect(`/cms/word-lists/${req.body.listId}`);
                    });
            });
    }

    function deleteWordList(req, res) {
        db.collection("wordlists").doc(req.body.listId)
            .delete()
            .then(() => {
                res.redirect("/cms/word-lists");
            });
    }

    if ("save-wordlist" in req.body && req.body.listName.trim()) {
        insertManualWordList(req, res);
    } else if ("delete-wordlist" in req.body) {
        deleteWordList(req, res);
    } else {
        res.redirect("/cms/word-lists");
    }
}
