import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Class codes storage
let classCodes = [];

// Fetch class codes from a CSV file
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

function setupAutocomplete() {
    const classCodeInput = document.querySelector(".class-code");
    const autocompleteList = document.createElement("ul");
    autocompleteList.classList.add("autocomplete-list");
    
    // Append dropdown inside the same container to ensure proper positioning
    classCodeInput.parentNode.appendChild(autocompleteList);

    classCodeInput.addEventListener("input", () => {
        const value = classCodeInput.value.trim().toUpperCase();
        autocompleteList.innerHTML = "";

        if (!value) return;

        // Filter class codes based on input
        const matches = classCodes.filter(code => code.startsWith(value)).slice(0, 5); // Show top 5 matches
        matches.forEach(match => {
            const item = document.createElement("li");
            item.textContent = match;
            item.classList.add("autocomplete-item");
            item.addEventListener("click", () => {
                classCodeInput.value = match;
                autocompleteList.innerHTML = "";
            });
            autocompleteList.appendChild(item);
        });
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (event) => {
        if (!classCodeInput.contains(event.target) && !autocompleteList.contains(event.target)) {
            autocompleteList.innerHTML = "";
        }
    });

    // Validate input on blur
    classCodeInput.addEventListener("blur", () => {
        setTimeout(() => {
            if (!classCodes.includes(classCodeInput.value.trim().toUpperCase())) {
                alert("❌ Invalid class code! Please select from the list.");
                classCodeInput.value = ""; // Clear invalid input
            }
        }, 200); // Delay to allow click selection
    });
}


// Load class codes and set up autocomplete
document.addEventListener("DOMContentLoaded", async () => {
    await fetchClassCodes();
    setupAutocomplete();
});

document.addEventListener("DOMContentLoaded", () => {
    
    const flashcardContainer = document.getElementById("flashcard-list");
    const addCardBtn = document.getElementById("add-card-btn");
    const setTitleInput = document.querySelector(".set-title");
    const classCodeInput = document.querySelector(".class-code");

    let editingSet = null;
    let editingSetId = null;

    // ✅ Check if an existing set is being edited (from Firestore)
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("You must be logged in to create or edit sets.");
            window.location.href = "../../index.html";
            return;
        }

        const storedSet = JSON.parse(localStorage.getItem("editingFlashcardSet"));
        if (storedSet && storedSet.id) {
            editingSet = storedSet;
            editingSetId = storedSet.id;
            console.log("Editing an existing set:", editingSet);

            setTitleInput.value = editingSet.title || "";
            classCodeInput.value = editingSet.classCode || "";

            flashcardContainer.innerHTML = ""; // ✅ Clear flashcards before appending new ones

            if (Array.isArray(editingSet.flashcards) && editingSet.flashcards.length > 0) {
                editingSet.flashcards.forEach((card, index) => {
                    const flashcard = createFlashcard(index + 1, card.question, card.answer);
                    flashcardContainer.appendChild(flashcard);
                });
            } else {
                console.warn("⚠ No flashcards found. Initializing a single empty flashcard.");
                flashcardContainer.appendChild(createFlashcard(1, "", ""));
            }
        } else {
            // ✅ Ensure only **one** flashcard is added for a new set
            if (flashcardContainer.children.length === 0) {
                flashcardContainer.appendChild(createFlashcard(1, "", ""));
            }
        }
    });

    // ✅ Function to create a new flashcard
    function createFlashcard(number, question = "", answer = "") {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        flashcard.innerHTML = `
            <span class="card-number">${number}</span>
            <div class="question-container">
                <label>Question:</label>
                <textarea placeholder="Enter Your Question">${question}</textarea>
            </div>
            <div class="answer-container">
                <label>Answer:</label>
                <textarea placeholder="Enter Your Answer">${answer}</textarea>
            </div>
            <button class="delete-card">✖</button>
        `;

        flashcard.querySelector(".delete-card").addEventListener("click", () => deleteFlashcard(flashcard));
        return flashcard;
    }

    // ✅ Function to delete a flashcard
    function deleteFlashcard(flashcard) {
        flashcard.remove();
        updateCardNumbers();

        // Ensure at least one flashcard remains
        if (flashcardContainer.children.length === 0) {
            flashcardContainer.appendChild(createFlashcard(1, "", ""));
        }
    }

    // ✅ Function to update flashcard numbers
    function updateCardNumbers() {
        document.querySelectorAll(".flashcard").forEach((card, index) => {
            card.querySelector(".card-number").textContent = index + 1;
        });
    }

    // ✅ Event Listener for Adding a New Flashcard
    addCardBtn.addEventListener("click", () => {
        const newFlashcard = createFlashcard(flashcardContainer.children.length + 1);
        flashcardContainer.appendChild(newFlashcard);
        updateCardNumbers();
    });

    // ✅ Function to save the flashcard set
    window.saveFlashcardSet = async function (isPublic) {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to save a set.");
            return;
        }

        const setTitle = setTitleInput.value.trim();
        const classCode = classCodeInput.value.trim();

        if (!setTitle || !classCode) {
            alert("Please provide a title and class code.");
            return;
        }

        // ✅ Extract flashcards
        const flashcards = [];
        document.querySelectorAll(".flashcard").forEach((card) => {
            const question = card.querySelector(".question-container textarea").value.trim();
            const answer = card.querySelector(".answer-container textarea").value.trim();

            if (question || answer) {
                flashcards.push({ question, answer });
            }
        });

        if (flashcards.length === 0) {
            alert("You need to add at least one flashcard.");
            return;
        }

        const icon = isPublic ? "../../FliplyPNGs/public flashcard icon.png" : "../../FliplyPNGs/private flashcard.png";
        const setId = editingSetId || crypto.randomUUID(); // Generate a new ID if it's a new set

        const newSet = {
            id: setId,
            title: setTitle,
            classCode: classCode,
            numCards: flashcards.length,
            flashcards: flashcards,
            isPublic: isPublic,
            icon: icon,
            createdAt: new Date().toISOString(),
        };

        try {
            const userRef = doc(db, "fliplyUsers", user.uid);
            const setsRef = collection(userRef, "flashcardSets");
            const setDocRef = doc(setsRef, setId);

            if (editingSet) {
                await updateDoc(setDocRef, newSet);
                console.log("✅ Flashcard set updated:", newSet);
            } else {
                await setDoc(setDocRef, newSet);
                console.log("✅ New flashcard set saved:", newSet);
            }

            localStorage.removeItem("editingFlashcardSet"); // Clear editing state
            window.location.href = "../dashboard/created_sets.html";
        } catch (error) {
            console.error("❌ Error saving flashcard set:", error.message);
            alert("Failed to save flashcard set.");
        }
    };

    const navItems = document.querySelectorAll(".nav-item"); // Select all nav links

    // Navigation Items Confirmation
navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        let hasText = false;
        document.querySelectorAll(".flashcard").forEach((flashcard) => {
            const questionText = flashcard.querySelector(".question-container textarea").value.trim();
            const answerText = flashcard.querySelector(".answer-container textarea").value.trim();
            if (questionText || answerText) {
                hasText = true;
            }
        });

        if (flashcardContainer.children.length === 1 && !hasText) {
            return;
        }

        if (!hasText) {
            return; // Prevent navigation if all flashcards are empty
        }

        let updatedTitle = document.querySelector(".set-title").value.trim();
        let updatedClassCode = document.querySelector(".class-code").value.trim();

        // ✅ Extract updated flashcards
        let updatedFlashcards = [];
        document.querySelectorAll(".flashcard").forEach((card) => {
            let question = card.querySelector(".question-container textarea").value.trim();
            let answer = card.querySelector(".answer-container textarea").value.trim();

            if (question || answer) {  // ✅ Ensure at least one field is filled
                updatedFlashcards.push({ question, answer });
            }
        });

        // ✅ Function to check if two flashcard arrays are identical
        function areFlashcardsEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) return false;
            return arr1.every((flashcard, index) => 
                flashcard.question === arr2[index].question &&
                flashcard.answer === arr2[index].answer
            );
        }

        // ✅ Check if no changes have been made when editing
        if (editingSet &&
            editingSet.title === updatedTitle &&
            editingSet.classCode === updatedClassCode &&
            areFlashcardsEqual(editingSet.flashcards, updatedFlashcards)
        ) {
            return; // No changes detected, allow navigation without confirmation
        }

        event.preventDefault();
        const destination = item.getAttribute("href"); // Get the target link
        showExitConfirmation(destination);
    });
});

    function showExitConfirmation(destination) {
        // Remove any existing modal to prevent duplicates
        const existingModal = document.querySelector(".exit-modal");
        if (existingModal) {
            existingModal.remove();
        }

        // Create a modal container
        const modal = document.createElement("div");
        modal.classList.add("exit-modal");

        // Modal content
        modal.innerHTML = `
            <div class="exit-modal-content">
                <p>Do you want to save before leaving?</p>
                <button class="modal-btn save-exit">Save and Exit</button>
                <button class="modal-btn exit-no-save">Exit Without Saving</button>
                <button class="modal-btn cancel">Cancel</button>
            </div>
        `;

        // Append modal to body
        document.body.appendChild(modal);

        // Add event listeners to buttons
        document.querySelector(".save-exit").addEventListener("click", () => {
            // Get Set Title & Class Code
            const setTitle = document.querySelector(".set-title").value.trim();
            const classCode = document.querySelector(".class-code").value.trim();

            if (!setTitle || !classCode) {
                alert("Please provide a title and class code.");
                return; // Stop function, do not navigate
            }
            saveFlashcardSet(false);
            window.location.href = destination;
        });

        document.querySelector(".exit-no-save").addEventListener("click", () => {
            window.location.href = destination; // Navigate without saving
        });

        document.querySelector(".cancel").addEventListener("click", () => {
            modal.remove(); // Close modal without leaving
        });
    }
});
