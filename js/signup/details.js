import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function () {
    const submit = document.getElementById("submit-details");

    submit.addEventListener("click", async function (event) {
        event.preventDefault();  // ✅ Prevents form from reloading

        const university = document.getElementById("university").value.trim();
        const fieldOfStudy = document.getElementById("fieldOfStudy").value.trim();

        // ✅ Ensure a user is logged in
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // ✅ Update Firestore document with additional details
                    await updateDoc(doc(db, "fliplyUsers", user.uid), {
                        university: university,
                        fieldOfStudy: fieldOfStudy
                    });

                    console.log("✅ User details updated in Firestore.");


                    // ✅ Redirect after saving
                    window.location.href = "../dashboard/created_sets.html";
                } catch (error) {
                    console.error("❌ Firestore update error:", error.message);
                    alert(error.message);
                }
            } else {
                console.warn("❌ No user is logged in.");

            }
        });
    });
});
