// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3BJ2AGz5Uokrv_KVERGWY7_8akQ-7Ex4",
  authDomain: "user-data-3807b.firebaseapp.com",
  projectId: "user-data-3807b",
  storageBucket: "user-data-3807b.firebasestorage.app",
  messagingSenderId: "625479633247",
  appId: "1:625479633247:web:49270136aa826f4f688eea",
  measurementId: "G-3R93RHJM45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Handle Sign-Up form submission
document.getElementById('submit-signup').addEventListener('click', (event) => {
  event.preventDefault();

  const nameSignup = document.getElementById('name-signup').value;
  const emailSignup = document.getElementById('email-signup').value;
  const passwordSignup = document.getElementById('password-signup').value;

  if (!nameSignup || !emailSignup || !passwordSignup) {
    alert("Please fill in all fields.");
    return;
  }

  // Create user with email and password using Firebase Authentication
  createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
    .then((userCredential) => {
      // User successfully signed up
      const user = userCredential.user;

      // Store the user's name and email in Firestore
      setDoc(doc(db, "users", user.uid), {
        name: nameSignup,
        email: emailSignup,
      })
        .then(() => {
          alert("Account Created Successfully!"); // Ensure this alert shows after user creation
          // Redirect to success page with user email and days left as query parameters
          window.location.href = `success.html?email=${user.email}&daysLeft=0`; // No days calculation at signup
        })
        .catch((error) => {
          alert("Error saving user data: " + error.message);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        alert("The email is already in use. Please log in instead.");
      } else {
        alert("Error: " + errorMessage);
      }
    });
});

// Handle Login form submission
document.getElementById('submit-login').addEventListener('click', (event) => {
  event.preventDefault();

  const emailLogin = document.getElementById('email-login').value;
  const passwordLogin = document.getElementById('password-login').value;

  if (!emailLogin || !passwordLogin) {
    alert("Please fill in all fields.");
    return;
  }

  // Sign in with email and password using Firebase Authentication
  signInWithEmailAndPassword(auth, emailLogin, passwordLogin)
    .then((userCredential) => {
      // Successfully logged in
      const user = userCredential.user;

      // Get registration date and calculate days since registration
      const registrationDate = user.metadata.creationTime;  // This gives the account creation time as a string
      const registrationTime = new Date(registrationDate).getTime();
      const currentTime = new Date().getTime();
      const daysLeft = Math.floor((currentTime - registrationTime) / (1000 * 3600 * 24));

      // Redirect to success.html with the email and days left as URL parameters
      window.location.href = `success.html?email=${user.email}&daysLeft=${daysLeft}`;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
});
