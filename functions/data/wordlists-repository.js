const fb = require("../firebase");
const db = fb.firestore();
const WORDLISTS_COLLECTION_NAME = "wordlists";

// export function getWordLists() {
//     return db.collection(WORDLISTS_COLLECTION_NAME).get();
// }