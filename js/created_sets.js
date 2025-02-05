document.addEventListener("DOMContentLoaded", function () {
    const setsContainer = document.getElementById("sets-container");
    const savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];

    if (savedSets.length === 0) {
        setsContainer.innerHTML = "<p>No sets created yet.</p>";
        return;
    }

    else{
        document.getElementById("create-set-helper").style.display = "none";

    }

    savedSets.forEach(set => {

        const setElement = document.createElement("div");
        setElement.classList.add("flashcard-set");

        setElement.innerHTML = `
            <div class="flashcard-box">
                <img src="../../FliplyPNGs/${set.icon}" alt="Flashcard Icon" class="flashcard-icon">
                <h3>${set.title}</h3>
                <p><strong>${set.classCode}</strong></p>
                <p># Of Cards: ${set.numCards}</p>

                <!-- Three Dots Button for Options -->
                <button class="options-btn" onclick="toggleOptions(${savedSets.indexOf(set)})">
                    <img src="../../FliplyPNGs/three dots.png" alt="Options">
                </button>

                <!-- Dropdown Menu for Edit/Delete -->
                <div class="menu-options" id="menu-${savedSets.indexOf(set)}">
                    <button class="edit-btn" onclick="editSet(${savedSets.indexOf(set)})">Edit</button>
                    <button class="dlt-btn" onclick="deleteSet(${savedSets.indexOf(set)})">Delete</button>
                </div>

                
            </div>
        `;

        setsContainer.appendChild(setElement);
    });
});

function toggleOptions(index) {
    const menu = document.getElementById(`menu-${index}`);

    // Check if the menu is currently displayed
    if (menu.style.display === "block") {
        menu.style.display = "none"; // Hide menu if it's already open
    } else {
        // Hide all other menus before showing the current one
        document.querySelectorAll(".menu-options").forEach((el) => {
            el.style.display = "none";
        });

        menu.style.display = "block"; // Show menu

        // Add an event listener to close when clicking outside
        document.addEventListener("click", function hideMenu(event) {
            if (!menu.contains(event.target) && !event.target.closest(".options-btn")) {
                menu.style.display = "none"; // Hide the menu
                document.removeEventListener("click", hideMenu); // Remove event listener after executing
            }
        });
    }
}
// Function to Edit a Set (Redirect to Edit Page)
function editSet(index) {
    // Retrieve saved sets from localStorage
    let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];

    // Check if the set exists at the given index
    if (index < 0 || index >= savedSets.length) {
        alert("Error: Flashcard set not found.");
        return;
    }

    // Get the selected flashcard set
    const selectedSet = savedSets[index];

    // Store the selected set in localStorage to retrieve in set_creator.html
    localStorage.setItem("editingFlashcardSet", JSON.stringify(selectedSet));

    // Redirect to set creator page
    window.location.href = "../set_creation/set_creator.html";
}

// Function to Delete a Set
function deleteSet(index) {
    let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    savedSets.splice(index, 1);  // Remove from array
    localStorage.setItem("flashcardSets", JSON.stringify(savedSets));  // Save updated list
    location.reload();  // Refresh page to update UI
}
