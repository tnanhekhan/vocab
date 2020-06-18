const fb = require("../../firebase");
const bucket = fb.storage().bucket();
const db = fb.firestore();
const auth = fb.auth();
const WORDLISTS_COLLECTION_NAME = "wordlists";
const WORDS_COLLECTION_NAME = "wordcollection";
const wordListsCollection = db.collection(WORDLISTS_COLLECTION_NAME);
const CLASSES_COLLECTION_NAME = "classes";
const classesCollection = db.collection(CLASSES_COLLECTION_NAME);

module.exports = {WORDS_COLLECTION_NAME, wordListsCollection, db, bucket, classesCollection}