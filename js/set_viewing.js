import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
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

document.addEventListener("DOMContentLoaded", () => {
    const flashcardContainer = document.getElementById("flashcard-list");
    const setTitleElement = document.querySelector(".set-title");
    const classCodeElement = document.querySelector(".class-code");
    const editSetBtn = document.querySelector(".edit-set-btn");

    // ✅ Retrieve the selected set from localStorage
    let viewingSet = JSON.parse(localStorage.getItem("viewingFlashcardSet"));

    if (!viewingSet || !viewingSet.id) {
        alert("Error: No flashcard set found.");
        window.location.href = "../dashboard/created_sets.html"; // Redirect back
        return;
    }

    console.log("Viewing set:", viewingSet);

    // ✅ Populate the title and class code
    setTitleElement.textContent = viewingSet.title || "Untitled Set";
    classCodeElement.textContent = viewingSet.classCode || "No Class Code";

    // ✅ Clear any existing flashcards before loading new ones
    flashcardContainer.innerHTML = "";

    if (Array.isArray(viewingSet.flashcards) && viewingSet.flashcards.length > 0) {
        viewingSet.flashcards.forEach((card, index) => {
            const flashcard = createFlashcard(index + 1, card.question, card.answer);
            flashcardContainer.appendChild(flashcard);
        });
    } else {
        console.warn("⚠ No flashcards found in this set.");
        flashcardContainer.appendChild(createFlashcard(1, "No Question", "No Answer"));
    }

    // ✅ Edit button functionality
    editSetBtn.addEventListener("click", () => editSet(viewingSet.id));

    // ✅ Function to create a flashcard in view mode
    function createFlashcard(number, question, answer) {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        flashcard.innerHTML = `
            <span class="card-number">${number}</span>
            <div class="flashcard-content">
                <div class="question-container">
                    <label>Question:</label>
                    <div class="question-text">${question || "No Question"}</div>
                </div>
                <div class="answer-container">
                    <label>Answer:</label>
                    <div class="answer-text">${answer || "No Answer"}</div>
                </div>
            </div>
        `;

        return flashcard;
    }

    document.querySelector(".view-mode-flash").addEventListener("click", () => {
        window.location.href = "flashcard_view.html";
    });

    // ✅ Function to edit a set (Redirect to edit page)
    async function editSet(setId) {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to edit this set.");
            return;
        }

        try {
            const userRef = doc(db, "fliplyUsers", user.uid);
            const setDocRef = doc(userRef, "flashcardSets", setId);
            const docSnap = await getDoc(setDocRef);

            if (docSnap.exists()) {
                localStorage.setItem("editingFlashcardSet", JSON.stringify(docSnap.data()));
                window.location.href = "../set_creation/set_creator.html";
            } else {
                alert("Flashcard set not found.");
            }
        } catch (error) {
            console.error("❌ Error editing flashcard set:", error.message);
            alert("Failed to edit flashcard set.");
        }
    }
});
