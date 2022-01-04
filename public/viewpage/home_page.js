import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import { attachRealtimeListener, initFirestoreDocs } from '../controller/firestore_controller.js';

export let unsubButtonsDoc = null;

export function addEventListeners() {

  window.addEventListener('unload', e => {
    if (unsubButtonsDoc) {
      unsubButtonsDoc();
    }
    console.log('window about to unload');
  });

  Elements.buttonInitConfig.addEventListener('click', async e => {
    try {
      await initFirestoreDocs();
      alert('Firestore collection initialized!')
    } catch (e) {
      console.log(`Init Config error:\n${e}`);
      alert(`Init Config error:\n${e}`);
    }
  });

}

export function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }

  let html = '<h3 class="d-flex justify-content-center m-3">Control Panel<h3>';
  html += `
    <div class="d-flex justify-content-start">
      <h5>Monitor Button Status:</h5>
      <button id="button-monitor-button-status" type="input" class="btn btn-outline-primary ms-3">
        Start</button>
    </div>
    <div class="d-flex justify-content-start">
      <h5>Button1:</h5>
      <button disabled id="status-button1" type="input" class="btn btn-outline-secondary mx-3">
      N/A</button>
      <h5>Button2:</h5>
      <button disabled id="status-button2" type="input" class="btn btn-outline-secondary mx-3">
      N/A</button>
    </div>
  `;

  Elements.root.innerHTML = html;

  const statusMonitorButton = document.getElementById('button-monitor-button-status');
  statusMonitorButton.addEventListener('click', e => {
    const label = e.target.innerHTML;
    if (label === 'Start') {
      e.target.innerHTML = 'Stop';
      // listen to Firestore doc changes
	  unsubButtonsDoc = attachRealtimeListener(Constants.COLLECTION,
			Constants.DOCNAME_BUTTONS, buttonListener);
    } else {
      e.target.innerHTML = 'Start';
      const status1 = document.getElementById('status-button1');
      const status2 = document.getElementById('status-button2');
      status1.innerHTML = 'N/A';
      status2.innerHTML = 'N/A';
      if (unsubButtonsDoc) unsubButtonsDoc();
    }
  });

}

function buttonListener(doc) {
  const status1 = document.getElementById('status-button1');
  const status2 = document.getElementById('status-button2');
  const buttonDoc = doc.data();
  if (buttonDoc['button1_on']) {
    status1.innerHTML = 'ON';
  } else {
    status1.innerHTML = 'OFF';
  }
  if (buttonDoc['button2_on']) {
    status2.innerHTML = 'ON';
  } else {
    status2.innerHTML = 'OFF';
  }
}