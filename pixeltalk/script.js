// ============================================
// PIXELTALK + FIREBASE FIRESTORE
// ============================================


// Firebase App
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


// Firestore
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ============================================
// FIREBASE CONFIG
// ============================================

const firebaseConfig = {

  apiKey:
    "AIzaSyDmyY0J2uDjTJHfwTKPJIetLpZu_8j-2t0",

  authDomain:
    "pixeltalk-web.firebaseapp.com",

  projectId:
    "pixeltalk-web",

  storageBucket:
    "pixeltalk-web.firebasestorage.app",

  messagingSenderId:
    "212734467277",

  appId:
    "1:212734467277:web:2521c220cbb551ab54dd84",

  measurementId:
    "G-33DH0JJNN1"

};


// ============================================
// INITIALIZE FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ============================================
// GET ELEMENTS
// ============================================

const messageForm =
  document.getElementById("messageForm");

const messageInput =
  document.getElementById("messageInput");

const charCount =
  document.getElementById("charCount");

const sendButton =
  document.getElementById("sendButton");

const statusMessage =
  document.getElementById("statusMessage");

const score =
  document.getElementById("score");


// ============================================
// CHARACTER COUNTER
// ============================================

messageInput.addEventListener(
  "input",
  () => {

    charCount.textContent =
      messageInput.value.length;

  }
);


// ============================================
// SEND MESSAGE
// ============================================

messageForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const message =
      messageInput.value.trim();


    // Empty message
    if (!message) {

      showStatus(
        "⚠️ TYPE SOMETHING FIRST!",
        "error"
      );

      return;
    }


    // Length protection
    if (message.length > 500) {

      showStatus(
        "⚠️ MESSAGE IS TOO LONG!",
        "error"
      );

      return;
    }


    // Disable button
    sendButton.disabled = true;

    sendButton.textContent =
      "🚀 SENDING...";


    try {

      // Add message to Firestore
      await addDoc(
        collection(
          db,
          "messages"
        ),
        {

          message:
            message,

          createdAt:
            serverTimestamp(),

          anonymous:
            true

        }
      );


      // Clear input
      messageInput.value = "";

      charCount.textContent =
        "0";


      // Increase score
      const currentScore =
        parseInt(
          score.textContent,
          10
        ) || 0;


      score.textContent =
        String(
          currentScore + 10
        ).padStart(5, "0");


      // Success
      showStatus(
        "✨ MESSAGE SENT! ✨",
        "success"
      );


    } catch (error) {

      console.error(
        "Firestore error:",
        error
      );


      showStatus(
        "❌ COULDN'T SEND. CHECK FIREBASE.",
        "error"
      );

    }


    // Enable again
    sendButton.disabled =
      false;

    sendButton.textContent =
      "🚀 SEND MESSAGE";

  }
);


// ============================================
// STATUS MESSAGE
// ============================================

function showStatus(
  message,
  type
) {

  statusMessage.textContent =
    message;

  statusMessage.className =
    "status-message " + type;


  setTimeout(
    () => {

      statusMessage.textContent =
        "";

      statusMessage.className =
        "status-message";

    },
    4000
  );

}
