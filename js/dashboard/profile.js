import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7kco7ZVwxAYyFKgxOK1fUDPkONZXRXkk",
    authDomain: "fliply-f4f1b.firebaseapp.com",
    projectId: "fliply-f4f1b",
    storageBucket: "fliply-f4f1b.firebasestorage.app",
    messagingSenderId: "42472944957",
    appId: "1:42472944957:web:259686a07b8e129d144154",
    measurementId: "G-2Z46WEJE6G"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Wait until DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("✅ User logged in:", user.uid);
            
            try {
                const userRef = doc(db, "fliplyUsers", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    // ✅ Update Profile Information
                    document.getElementById("profile-username").innerHTML = `${userData.username} <span class="likes">❤️ <strong id="profile-likes">502</strong></span>`;
                    document.getElementById("profile-university").textContent = userData.university || "Not Provided";
                    document.getElementById("profile-fieldOfStudy").textContent = userData.fieldOfStudy || "Not Provided";
                    
                    console.log("✅ User data loaded:", userData);
                } else {
                    console.warn("❌ No user data found in Firestore.");
                }
            } catch (error) {
                console.error("❌ Error fetching user data:", error.message);
            }
        } else {
            console.warn("❌ No user logged in. Redirecting to login.");
            window.location.href = "../../index.html"; // Redirect to login if not logged in
        }
    });


        // ✅ Sign Out Button
        const signOutBtn = document.getElementById("signout-btn");
        if (signOutBtn) {
            signOutBtn.addEventListener("click", async () => {
                try {
                    await signOut(auth);
                    console.log("✅ User signed out.");
                    window.location.href = "../../index.html"; // Redirect to login page
                } catch (error) {
                    console.error("❌ Sign Out Error:", error.message);
                }
            });
        }
    });

