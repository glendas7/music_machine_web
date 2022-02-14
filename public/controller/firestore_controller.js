import {
	getFirestore, onSnapshot, doc, setDoc, updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore();

export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_DISTANCE), Constants.docDistance)
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_CAMERA), Constants.docCamera)
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_PICS), Constants.docPics)
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOCNAME_VISITOR), Constants.docVisitor)
}

export function attachRealtimeListener(collection, document, callback) {
	const unsubscribeListener = onSnapshot(doc(db, collection, document), callback);
	return unsubscribeListener;
}

export async function updateDocForVisitors(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.DOCNAME_VISITOR);
	await updateDoc(docRef, update);
}

