import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
  updateNoteData, updateFreqData, updateLedData, updateButtonData, attachRealtimeListener, initFirestoreDocs,
} from '../controller/firestore_controller.js'

export let cameraDoc = null
export let pictureDoc = null
let switchToPiButton
let powerButton



export async function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }
  await initFirestoreDocs()
 
  updateFreqData({ frequency: "off" });
  updateNoteData({ note: "off" })
  updateLedData({ potOff: true })
  updateButtonData({ powerButton: "off" })

  let html = '';
  html += `
  <div class="d-flex justify-content-center m-3" content-box">
    <button type="submit" id="power-button" class="btn d-flex justify-content-center m-3">Power Off</button>
    <button type="submit" id="toggle-pi-button" class="btn" disabled>Switch to Pi</button>
  </div> 
  <div class="d-flex justify-content-center m-3" content-box">
    <h3>Frequency: </h3>
    <div class= "freq-content" id="frequency-content"></div>
  </div>
  <div class="d-flex justify-content-center m-3">
    <h5>Notes: </h5>
    <div class="note-container">
  `;

  Elements.root.innerHTML = html;


  freqDataDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.FREQ_DATA, freqDataListener); 
  
  var notesList = ['G4','G#4','A4','A#4', 'C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5']    
  notesList.forEach(note => {
    html += addNoteButton(note)
  })

  html += `
      </div>
    </div>
    `
  Elements.root.innerHTML = html

  document.getElementById('power-button').addEventListener('click', e => {
    powerButton = document.getElementById('power-button')
    if (powerButton.innerText == "Power Off") {
      console.log('click on ')
      updateLedData({ potOff: false })
      updateButtonData({ powerButton: "on" })
      powerButton.innerText = "Power On"
    }
    else if (powerButton.innerText == "Power On") {
      console.log('click off ')
      updateLedData({ potOff: true })
      updateButtonData({ powerButton: "off" })
      powerButton.innerText = "Power Off"
    }
})

  switchToPiButton = document.getElementById('toggle-pi-button')
  switchToPiButton.addEventListener('click', e => {
    switchToPiButton.disabled = true
    updateLedData({ potOff: false })
    updateNoteData({ note: "off" })
    updateFreqData({ frequency: "off" });
})

  const noteForms = document.getElementsByClassName('note-forms')
  for (let n = 0; n < noteForms.length; n++) {
      noteForms[n].addEventListener('submit', async e => {
          e.preventDefault()
        const noteVal = e.target.noteValue.value
        switchToPiButton.disabled = false
        updateNoteData({ note: noteVal })
        updateLedData({ potOff: true})
        console.log(noteVal)
      })
  }

}

function addNoteButton(note) {
  return `
  <form method= "post" class= "note-forms">
  <input type ="hidden" name ="noteValue" value="${note}">
  <button type="submit" class="btn">${note}</button>
  </form>
  `
}
  
function freqDataListener(doc) {
  const freqData = doc.data()
  if (freqData['frequency']) {
    document.getElementById('frequency-content').innerText = freqData['frequency']
  }
}



