document.addEventListener("DOMContentLoaded", function () {
    const setsContainer = document.getElementById("sets-container");
    const savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];

    if (savedSets.length === 0) {
        return;
    } else {
        document.getElementById("create-set-helper").style.display = "none";
    }

    savedSets.forEach((set, index) => {
        const setElement = document.createElement("div");
        setElement.classList.add("flashcard-set");

        setElement.innerHTML = `
            <div class="flashcard-box">
                <img src="${set.icon}" alt="Flashcard Icon" class="flashcard-icon">
                <h3>${set.title}</h3>
                <p><strong>${set.classCode}</strong></p>
                <p># Of Cards: ${set.numCards}</p>

                <!-- Three Dots Button for Options -->
                <button class="options-btn" onclick="toggleOptions('${set.id}')">
                    <img src="../../FliplyPNGs/three dots.png" alt="Options">
                </button>

                <!-- Dropdown Menu for Edit/Delete -->
                <div class="menu-options" id="menu-${set.id}">
                    <button class="edit-btn" onclick="editSet('${set.id}')">Edit</button>
                    <button class="dlt-btn" onclick="deleteSet('${set.id}')">Delete</button>
                </div>
            </div>
        `;

        setsContainer.appendChild(setElement);
    });
});
// Function to Clear LocalStorage & Redirect for Creating a New Set
function clearAndCreateSet() {
    localStorage.removeItem("editingFlashcardSet"); // 💥 Ensures fresh start
    window.location.href = "../set_creation/set_creator.html";
}

// Attach function to "Create Set" button
document.getElementById("create-set-btn").addEventListener("click", clearAndCreateSet);

// Function to Toggle Dropdown Options Menu
function toggleOptions(index) {
    const menu = document.getElementById(`menu-${index}`);

    // Check if menu is currently displayed
    if (menu.style.display === "block") {
        menu.style.display = "none"; // Hide if already open
    } else {
        // Hide other menus before showing the current one
        document.querySelectorAll(".menu-options").forEach((el) => {
            el.style.display = "none";
        });

        menu.style.display = "block"; // Show menu

        // Close when clicking outside
        document.addEventListener("click", function hideMenu(event) {
            if (!menu.contains(event.target) && !event.target.closest(".options-btn")) {
                menu.style.display = "none";
                document.removeEventListener("click", hideMenu);
            }
        });
    }
}

// Function to Edit a Set (Redirect to Edit Page)

function editSet(setId) {
    let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    const editingSet = savedSets.find(set => set.id === setId);

    if (!editingSet) {
        alert("Error: Flashcard set not found.");
        return;
    }

    localStorage.setItem("editingFlashcardSet", JSON.stringify(editingSet));
    window.location.href = "../set_creation/set_creator.html";
}



function deleteSet(setId) {
    let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    savedSets = savedSets.filter(set => set.id !== setId);  // ✅ Remove by unique ID
    localStorage.setItem("flashcardSets", JSON.stringify(savedSets));
    location.reload();
}

