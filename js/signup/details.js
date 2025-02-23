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

// DOM Elements
const universityInput = document.getElementById("university");
const fieldOfStudyInput = document.getElementById("fieldOfStudy");
const submitButton = document.getElementById("submit-details");
const dropdown = document.getElementById("university-dropdown");

// Autocomplete Variables
let universities = [];
let selectedUniversity = "";

// Load university list from CSV file
async function loadUniversities() {
    try {
        const response = await fetch("../../class_code_data/schools.csv"); // Update the path if needed
        const text = await response.text();
        universities = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    } catch (error) {
        console.error("❌ Error loading universities:", error);
    }
}

// Function to filter and display autocomplete suggestions
function filterUniversities() {
    const input = universityInput.value.trim().toLowerCase();
    dropdown.innerHTML = "";

    if (!input) {
        dropdown.classList.remove("active");
        return;
    }

    // Filter universities that match input
    const matches = universities.filter(uni => uni.toLowerCase().includes(input)).slice(0, 5);

    if (matches.length === 0) {
        dropdown.classList.remove("active");
        return;
    }

    // Append matches to dropdown
    matches.forEach(match => {
        const item = document.createElement("li");
        item.textContent = match;
        item.classList.add("autocomplete-item");

        item.addEventListener("click", () => {
            universityInput.value = match;
            selectedUniversity = match; // Store selected value
            dropdown.classList.remove("active");
        });

        dropdown.appendChild(item);
    });

    dropdown.classList.add("active");
}

// Ensure user selects a university from the list
universityInput.addEventListener("blur", () => {
    setTimeout(() => {
        if (universityInput.value !== selectedUniversity) {
            universityInput.value = ""; // Clear input if invalid
        }
        dropdown.classList.remove("active");
    }, 200); // Delay to allow click events
});

// Event Listeners for Autocomplete
universityInput.addEventListener("input", filterUniversities);
universityInput.addEventListener("focus", filterUniversities);

// Handle form submission
submitButton.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevents form from reloading

    const university = universityInput.value.trim();
    const fieldOfStudy = fieldOfStudyInput.value.trim();

    if (!universities.includes(university)) {
        alert("Please select a valid university from the list.");
        return;
    }

    // Ensure a user is logged in
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Update Firestore document with additional details
                await updateDoc(doc(db, "fliplyUsers", user.uid), {
                    university: university,
                    fieldOfStudy: fieldOfStudy
                });

                console.log("✅ User details updated in Firestore.");
                window.location.href = "../dashboard/created_sets.html"; // Redirect after saving
            } catch (error) {
                console.error("❌ Firestore update error:", error.message);
                alert(error.message);
            }
        } else {
            console.warn("❌ No user is logged in.");
        }
    });
});

// Load universities on page load
document.addEventListener("DOMContentLoaded", loadUniversities);
