import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
  updateDocForVisitors, attachRealtimeListener, initFirestoreDocs,
} from '../controller/firestore_controller.js'

export let cameraDoc = null
export let pictureDoc = null
let closeButton
let openButton
let loadingPic
let doorPic

export async function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }
  await initFirestoreDocs()
 
  updateDocForVisitors({ permission: false });
  updateDocForVisitors({ visitor_status: null });

  let html = '<h3 class="d-flex justify-content-center m-3">Control Panel<h3>';
  html += `
  <div style="background-color:rgb(240,248,255); margin-top: 50px;">
    <div>
      <h5>Door Control</h5>
      <button id="button-close" type="input" class="btn btn-outline-primary ms-3" disabled>CLOSED</button>
      <button id="button-open" type="input" class="btn btn-outline-primary ms-3" disabled>OPEN</button>

    </div>
  </div>

  <div style="background-color:rgb(240,248,255); margin-top: 50px;">
    <div id="image-timestamp"></div>
    <img id="image" src="../model/images/front_door.png" height=300>
  </div>
  `;

  Elements.root.innerHTML = html;

  loadingPic = '../model/images/fall-out-wait.gif'
  doorPic = '../model/images/front_door.png'
  document.getElementById('image-timestamp').innerText = ""

  closeButton = document.getElementById('button-close')
  openButton = document.getElementById('button-open')
  closeButton.disabled = true
  openButton.disabled = true

  cameraDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.DOCNAME_CAMERA, cameraListener); 
  pictureDoc = attachRealtimeListener(Constants.COLLECTION, Constants.DOCNAME_PICS, pictureListener);

  closeButton.addEventListener('click', e => {
    updateDocForVisitors({ permission: false });
    updateDocForVisitors({ visitor_status: null });
    document.getElementById('image').src = doorPic
    document.getElementById('image-timestamp').innerText = ""
    closeButton.disabled = true;
    openButton.disabled = true;
  });

  openButton.addEventListener('click', e => {
    updateDocForVisitors({ permission: true });
    updateDocForVisitors({ visitor_status: null });
    document.getElementById('image').src = doorPic
    document.getElementById('image-timestamp').innerText = ""
    openButton.disabled = true;
    closeButton.disabled = true;
  });

}

function cameraListener(doc) {
  const cameraDoc = doc.data()
  if (cameraDoc['url'] != null) {
    document.getElementById('image').src = loadingPic
    const cameraDoc = doc.data();
    const timestamp = cameraDoc['timestamp'];
    document.getElementById('image-timestamp').innerText = new Date(timestamp / 1e6).toString();
  }
}

function pictureListener(doc) {
  const pictureDoc = doc.data();
  // updateDocForVisitors({ permission: false });
  // updateDocForVisitors({ visitor_status: true });
  if (pictureDoc['pic1'] != null) {
    document.getElementById('image').src = pictureDoc['pic1']
    openButton.disabled = false
    closeButton.disabled = false
  }
}
