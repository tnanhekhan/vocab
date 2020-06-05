const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./admin.json');

const credential = admin.credential.cert(serviceAccount);
const databaseURL = functions.config()/*.database.url*/;
const storageBucket = functions.config().storage.url;
module.exports = admin.initializeApp({credential: credential, databaseURL: databaseURL, storageBucket: storageBucket});