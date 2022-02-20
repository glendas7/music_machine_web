import {
	getFirestore, onSnapshot, doc, setDoc, updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore()


export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.NOTE_DATA), Constants.noteData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.FREQ_DATA), Constants.freqData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.LED_DATA), Constants.ledData)
	await setDoc(doc(db, Constants.COLLECTION, Constants.BUTTON_DATA), Constants.buttonData)
}

export function attachRealtimeListener(collection, document, callback) {
	const unsubscribeListener = onSnapshot(doc(db, collection, document), callback);
	return unsubscribeListener;
}

export async function updateNoteData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.NOTE_DATA);
	await updateDoc(docRef, update);
}


export async function updateFreqData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.FREQ_DATA);
	await updateDoc(docRef, update);
}

export async function updateLedData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.LED_DATA);
	await updateDoc(docRef, update);
}

export async function updateButtonData(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.BUTTON_DATA);
	await updateDoc(docRef, update);
}

