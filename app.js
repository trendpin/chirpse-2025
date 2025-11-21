const firebaseConfig = { /* ← PASTE YOUR REAL CONFIG HERE */ 
  apiKey: "YOUR_API_KEY",
  authDomain: "chirpse-2025.firebaseapp.com",
  projectId: "chirpse-2025",
  storageBucket: "chirpse-2025.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:xxxxxxxxxxxxxxxxxx"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

let me = null;
auth.onAuthStateChanged(user => {
  if (user) { me = user; document.body.classList.add("logged-in"); }
  else if (!location.pathname.includes("index.html")) location.href = "index.html";
});

function signup() { /* same as before */ }
function login() { /* same as before */ }
