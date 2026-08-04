// ==========================================
// PIXELTALK — FIREBASE FIRESTORE
// ==========================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================
// PALITAN MO ITO NG CONFIG NG FIREBASE PROJECT MO

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const form = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const charCount = document.getElementById("charCount");
const statusMessage = document.getElementById("statusMessage");
const sendButton = document.getElementById("sendButton");


// ==========================================
// CHARACTER COUNTER
// ==========================================

messageInput.addEventListener("input", () => {

  const length = messageInput.value.length;

  charCount.textContent = length;

});


// ==========================================
// SEND MESSAGE TO FIRESTORE
// ==========================================

form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const message = messageInput.value.trim();


  // Don't allow empty messages
  if (!message) {

    showStatus(
      "⚠️ TYPE SOMETHING FIRST!",
      "error"
    );

    return;
  }


  // Maximum length check
  if (message.length > 500) {

    showStatus(
      "⚠️ MESSAGE IS TOO LONG!",
      "error"
    );

    return;
  }


  // Disable button while sending
  sendButton.disabled = true;

  sendButton.textContent = "🚀 SENDING...";


  try {

    // Save anonymous message
    await addDoc(
      collection(db, "pixeltalk_messages"),
      {
        message: message,

        createdAt: serverTimestamp(),

        // No name / email / account information is saved.
        anonymous: true
      }
    );


    // Clear form
    messageInput.value = "";
    charCount.textContent = "0";


    showStatus(
      "✨ MESSAGE SENT! THANK YOU FOR SHARING. ✨",
      "success"
    );


  } catch (error) {

    console.error("Firestore error:", error);

    showStatus(
      "❌ SOMETHING WENT WRONG. TRY AGAIN.",
      "error"
    );

  }


  // Enable button again
  sendButton.disabled = false;

  sendButton.textContent = "🚀 SEND MESSAGE";

});


// ==========================================
// STATUS MESSAGE
// ==========================================

function showStatus(message, type) {

  statusMessage.textContent = message;

  statusMessage.className = "status-message " + type;


  // Automatically clear after a few seconds
  setTimeout(() => {

    statusMessage.textContent = "";
    statusMessage.className = "status-message";

  }, 5000);

}