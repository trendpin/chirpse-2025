import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDniXwAIq7jCu3RkZBUnt76tgW5uC1Ld8",
  authDomain: "chirpse-2025.firebaseapp.com",
  projectId: "chirpse-2025",
  storageBucket: "chirpse-2025.appspot.com",
  messagingSenderId: "895121502746",
  appId: "1:895121502746:web:d4cdad596888f7bd7197a3",
  measurementId: "G-M8DE8H44S1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global variables that feed.js, profile.js, messages.js all use
let me = null;
let myName = "";
let myPic = "";

// Auth state listener (keeps user logged in across pages)
onAuthStateChanged(auth, async user => {
  if (user) {
    me = user;
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.data() || {};
    myName = data.username || "User";
    myPic = data.photoURL || "https://via.placeholder.com/120/666?text=You";
    document.body.classList.add("logged-in");

    if (location.pathname.includes("feed")) loadFeed?.();
    if (location.pathname.includes("profile")) loadMyPosts?.();
    if (location.pathname.includes("messages")) loadChats?.();

    if (location.pathname === "/" || location.pathname.includes("index.html")) {
      location.href = "feed.html";
    }
  } else {
    document.body.classList.remove("logged-in");
    if (!location.pathname.includes("index.html") && location.pathname !== "/") {
      location.href = "index.html";
    }
  }
});

// Signup
window.signup = async () => {
  const email = document.getElementById("email")?.value.trim();
  const pass = document.getElementById("pass")?.value;
  const username = document.getElementById("username")?.value.trim();
  if (!email || !pass || !username) return alert("Fill all fields");
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", cred.user.uid), { username, photoURL: "" });
    location.href = "feed.html";
  } catch (e) { alert(e.message); }
};

// Login
window.login = async () => {
  const email = document.getElementById("email")?.value.trim();
  const pass = document.getElementById("pass")?.value;
  if (!email || !pass) return alert("Fill email & password");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    location.href = "feed.html";
  } catch (e) { alert(e.message); }
};

// Logout
window.logout = () => signOut(auth);

// Export globals for other JS files
window.auth = auth;
window.db = db;
window.storage = storage;
window.me = () => me;
window.myName = () => myName;
window.myPic = () => myPic;
