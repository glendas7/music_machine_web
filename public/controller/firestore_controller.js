import {
	getFirestore, onSnapshot, doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore();

export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_BUTTONS), Constants.docButtons);
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_LEDS), Constants.docLEDs);
}

export function attachRealtimeListener(collection, document, callback) {
	onSnapshot(doc(db, collection, document), callback);
}