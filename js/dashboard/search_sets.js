import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// ✅ Firebase Setup
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
const db = getFirestore(app);

let classCodes = [];

// ✅ Fetch Class Codes from CSV
async function fetchClassCodes() {
    try {
        const response = await fetch("../../class_code_data/extracted_class_codes.csv");
        const text = await response.text();
        classCodes = text.split("\n").map(code => code.trim()).filter(code => code.length > 0);
        console.log("✅ Loaded class codes:", classCodes);
    } catch (error) {
        console.error("❌ Error loading class codes:", error);
    }
}

// ✅ Setup Autocomplete
function setupAutocomplete() {
    const classCodeInput = document.getElementById("class-code-input");
    const autocompleteList = document.createElement("ul");
    autocompleteList.classList.add("autocomplete-list");
    
    classCodeInput.parentNode.appendChild(autocompleteList);

    let isClickingSuggestion = false;  // Flag to track if a suggestion is clicked

    classCodeInput.addEventListener("input", () => {
        const value = classCodeInput.value.trim().toUpperCase();
        autocompleteList.innerHTML = "";

        if (!value) return;

        // ✅ Filter Class Codes
        const matches = classCodes.filter(code => code.startsWith(value)).slice(0, 5);
        matches.forEach(match => {
            const item = document.createElement("li");
            item.textContent = match;
            item.classList.add("autocomplete-item");
            item.addEventListener("mousedown", () => {
                isClickingSuggestion = true;  // Set flag before blur event triggers
                classCodeInput.value = match;
                autocompleteList.innerHTML = "";
            });
            autocompleteList.appendChild(item);
        });
    });

    // ✅ Hide List When Clicking Outside
    document.addEventListener("click", (event) => {
        if (!classCodeInput.contains(event.target) && !autocompleteList.contains(event.target)) {
            autocompleteList.innerHTML = "";
        }
    });

    // ✅ Validate Input After User Clicks Away
    classCodeInput.addEventListener("blur", () => {
        setTimeout(() => {
            if (!isClickingSuggestion && !classCodes.includes(classCodeInput.value.trim().toUpperCase())) {
                alert("❌ Invalid class code! Please select from the list.");
                classCodeInput.value = ""; // ✅ Clear invalid input
            }
            isClickingSuggestion = false;  // Reset flag
        }, 100);
    });
}

// ✅ Load Class Codes & Initialize Autocomplete
document.addEventListener("DOMContentLoaded", async () => {
    await fetchClassCodes();
    setupAutocomplete();
});
