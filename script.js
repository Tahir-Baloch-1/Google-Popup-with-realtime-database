import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDN8MsYkodS9tvJMZXgZz0Y5eKD8-chj5I",
    authDomain: "smit-form-realtime-data-base.firebaseapp.com",
    projectId: "smit-form-realtime-data-base",
    storageBucket: "smit-form-realtime-data-base.firebasestorage.app",
    databaseURL: "https://smit-form-realtime-data-base-default-rtdb.firebaseio.com",
    messagingSenderId: "988781871684",
    appId: "1:988781871684:web:3e0f3130a5126207d7f211",
    measurementId: "G-F91XFYTH1W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const rtdb = getDatabase(app);

const googleLoginBtn = document.getElementById("googleLoginBtn");
const detailsSection = document.getElementById("detailsSection");
const userPhoto = document.getElementById("userPhoto");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const extraDetailsForm = document.getElementById("extraDetailsForm");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");
const msg = document.getElementById("msg");

let currentUser = null;

// Google Popup Login
googleLoginBtn.addEventListener("click", async () => {
    msg.innerText = "";
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        msg.style.color = "red";
        msg.innerText = "Google Login Error: " + error.message;
    }
});

// Auth State Track Karna
onAuthStateChanged(auth, (user) => {
    currentUser = user;

    if (user) {
        googleLoginBtn.style.display = "none";
        detailsSection.style.display = "block";
        userName.innerText = user.displayName || "Google User";
        userEmail.innerText = user.email || "";
        userPhoto.src = user.photoURL || "https://via.placeholder.com/44";
    } else {
        googleLoginBtn.style.display = "block";
        detailsSection.style.display = "none";
    }
});

// Details Realtime Database Mein Save Karna
extraDetailsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    const userData = {
        uid: currentUser.uid,
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: document.getElementById("phone").value.trim(),
        course: document.getElementById("course").value,
        updatedAt: new Date().toLocaleString()
    };

    try {
        // Har user ka data us ke unique UID ke under save hoga
        await set(ref(rtdb, "google_users/" + currentUser.uid), userData);
        msg.style.color = "green";
        msg.innerText = "Details Realtime Database mein save ho gayin!";
        extraDetailsForm.reset();
    } catch (error) {
        msg.style.color = "red";
        msg.innerText = "Save Error: " + error.message;
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "Save to Realtime DB";
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    msg.style.color = "#333";
    msg.innerText = "Logged out.";
});