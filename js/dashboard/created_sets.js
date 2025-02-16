import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
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

// ✅ Load user's flashcard sets from Firestore
async function loadFlashcardSets() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
           
            window.location.href = "../../index.html";
            return;
        }

        const setsContainer = document.getElementById("sets-container");
        const createSetHelper = document.getElementById("create-set-helper");
        setsContainer.innerHTML = ""; // Clear existing content

        try {
            const userRef = doc(db, "fliplyUsers", user.uid);
            const setsRef = collection(userRef, "flashcardSets");
            const querySnapshot = await getDocs(setsRef);

            if (querySnapshot.empty) {
                console.log("No flashcard sets found.");
                setTimeout(() => {
                    createSetHelper.style.display = "block"; // Show helper AFTER loading
                }, 500); // Small delay ensures UI updates smoothly
                return;
            } else {
                createSetHelper.style.display = "none"; // Hide helper if sets exist
            }
            

            querySnapshot.forEach((doc) => {
                const set = doc.data();
                const setElement = document.createElement("div");
                setElement.classList.add("flashcard-set");

                setElement.innerHTML = `
                    <div class="flashcard-box">
                        <img src="${set.icon}" alt="Flashcard Icon" class="flashcard-icon">
                        <h3>${set.title}</h3>
                        <p><strong>${set.classCode}</strong></p>
                        <p># Of Cards: ${set.numCards}</p>

                        <!-- Three Dots Button for Options -->
                        <button class="options-btn" data-id="${set.id}">
                            <img src="../../FliplyPNGs/three dots.png" alt="Options">
                        </button>

                        <!-- Dropdown Menu for Edit/Delete -->
                        <div class="menu-options" id="menu-${set.id}">
                            <button class="edit-btn" data-id="${set.id}">Edit</button>
                            <button class="dlt-btn" data-id="${set.id}">Delete</button>
                        </div>
                    </div>
                `;

                // Prevent accidental opening when clicking options menu
                setElement.addEventListener("click", (e) => {
                    if (e.target.closest(".options-btn") || e.target.closest(".menu-options")) {
                        e.stopPropagation();
                        return;
                    }
                    openSet(set.id);
                });

                setsContainer.appendChild(setElement);
            });

            // ✅ Add event listeners for edit and delete buttons dynamically
            document.querySelectorAll(".options-btn").forEach((btn) => {
                btn.addEventListener("click", function () {
                    toggleOptions(this.getAttribute("data-id"));
                });
            });

            document.querySelectorAll(".edit-btn").forEach((btn) => {
                btn.addEventListener("click", function () {
                    editSet(this.getAttribute("data-id"));
                });
            });

            document.querySelectorAll(".dlt-btn").forEach((btn) => {
                btn.addEventListener("click", function () {
                    deleteSet(this.getAttribute("data-id"));
                });
            });

        } catch (error) {
            console.error("❌ Error loading flashcard sets:", error.message);
       
        }
    });
}

// ✅ Function to open a flashcard set (Save selected set in Firestore)
async function openSet(setId) {
    const user = auth.currentUser;
    if (!user) {
      
        return;
    }

    try {
        const userRef = doc(db, "fliplyUsers", user.uid);
        const setDocRef = doc(userRef, "flashcardSets", setId);
        const docSnap = await getDoc(setDocRef);

        if (docSnap.exists()) {
            localStorage.setItem("viewingFlashcardSet", JSON.stringify(docSnap.data()));
            window.location.href = "../flashcard_using/set_viewing.html";
        } else {
            
        }
    } catch (error) {
        console.error("❌ Error opening flashcard set:", error.message);
      
    }
}

// ✅ Function to create a new flashcard set
function clearAndCreateSet() {
    localStorage.removeItem("editingFlashcardSet"); // 💥 Ensures fresh start
    window.location.href = "../set_creation/set_creator.html";
}

// ✅ Attach function to "Create Set" button
document.getElementById("create-set-btn").addEventListener("click", clearAndCreateSet);

// ✅ Toggle dropdown menu options
function toggleOptions(setId) {
    const menu = document.getElementById(`menu-${setId}`);

    if (menu.style.display === "block") {
        menu.style.display = "none"; // Hide if already open
    } else {
        document.querySelectorAll(".menu-options").forEach((el) => {
            el.style.display = "none";
        });

        menu.style.display = "block"; // Show menu

        // Close menu when clicking outside
        document.addEventListener("click", function hideMenu(event) {
            if (!menu.contains(event.target) && !event.target.closest(".options-btn")) {
                menu.style.display = "none";
                document.removeEventListener("click", hideMenu);
            }
        });
    }
}

// ✅ Edit a set (Redirect to edit page)
async function editSet(setId) {
    const user = auth.currentUser;
    if (!user) {
      
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
        
        }
    } catch (error) {
        console.error("❌ Error editing flashcard set:", error.message);
      
    }
}

// ✅ Delete a set from Firestore
async function deleteSet(setId) {
    const user = auth.currentUser;
    if (!user) {
       
        return;
    }

    try {
        const userRef = doc(db, "fliplyUsers", user.uid);
        const setDocRef = doc(userRef, "flashcardSets", setId);
        await deleteDoc(setDocRef);

     
        location.reload();
    } catch (error) {
        console.error("❌ Error deleting flashcard set:", error.message);
   
    }
}

// ✅ Load flashcard sets on page load
document.addEventListener("DOMContentLoaded", loadFlashcardSets);
