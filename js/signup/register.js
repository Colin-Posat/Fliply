import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7kco7ZVwxAYyFKgxOK1fUDPkONZXRXkk",
    authDomain: "fliply-f4f1b.firebaseapp.com",
    projectId: "fliply-f4f1b",
    storageBucket: "fliply-f4f1b.firebasestorage.app",
    messagingSenderId: "42472944957",
    appId: "1:42472944957:web:259686a07b8e129d144154",
    measurementId: "G-2Z46WEJE6G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.addEventListener("DOMContentLoaded", function () {
    const submit = document.getElementById("submit-signup");

    submit.addEventListener("click", async function (event) {
        event.preventDefault();  // ✅ Prevents form from reloading

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const username = document.getElementById("username").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if(confirmPassword != password){
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if(password.length < 6){
            alert("Please make sure your password is at least six characters.")
            return;
        }



        console.log("Signing up with:", email, password, username);

        try {
            // ✅ Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log("✅ User created:", user);

            // ✅ Ensure user is authenticated before writing to Firestore
            if (user && user.uid) {
                await setDoc(doc(db, "fliplyUsers", user.uid), {
                    username: username,
                    email: email,
                    createdAt: new Date().toISOString()
                });

                console.log("✅ User data stored in Firestore.");

                window.location.href = "details.html"; // Redirect after signup
            } else {
                throw new Error("User authentication failed.");
            }
        } catch (error) {
            console.error("❌ Signup error:", error.message);

        }
    });
});
