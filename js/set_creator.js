document.addEventListener("DOMContentLoaded", () => {


    const flashcardContainer = document.getElementById("flashcard-list");
    const addCardBtn = document.getElementById("add-card-btn");
    const setTitleInput = document.querySelector(".set-title");
    const classCodeInput = document.querySelector(".class-code");

    // Ensure the first flashcard exists and behaves like a dynamic one
    if (flashcardContainer.children.length === 1) {
        setupFlashcard(flashcardContainer.children[0], 1);
    }
    
    let editingaSet = false;
    

    // 💥 Check if an existing set is being edited
    let editingSet = JSON.parse(localStorage.getItem("editingFlashcardSet"));

    if (editingSet) {
        editingaSet = true;

        console.log("Editing an existing set:", editingSet);

        setTitleInput.value = editingSet.title || "";
        classCodeInput.value = editingSet.classCode || "";

        if (Array.isArray(editingSet.flashcards) && editingSet.flashcards.length > 0) {
            flashcardContainer.innerHTML = ""; // ✅ Clears any pre-existing flashcards to prevent duplicates
            editingSet.flashcards.forEach((card, index) => {
                const flashcard = createFlashcard(index + 1);
                flashcard.querySelector(".question-container textarea").value = card.question;
                flashcard.querySelector(".answer-container textarea").value = card.answer;
                flashcardContainer.appendChild(flashcard);
            });
        } else {
            console.warn("⚠ No flashcards found in this set. Initializing a single empty flashcard.");
            flashcardContainer.innerHTML = ""; // ✅ Clears to prevent duplicates
            flashcardContainer.appendChild(createFlashcard(1));
        }

       
    } 

    


    // Function to create a new flashcard
    function createFlashcard(number) {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");
        setupFlashcard(flashcard, number);
        return flashcard;
    }

    // Function to set up a flashcard (for both pre-existing and dynamically created flashcards)
    function setupFlashcard(flashcard, number) {
        flashcard.innerHTML = `
            <span class="card-number">${number}</span>
            <div class="question-container">
                <label>Question:</label>
                <textarea placeholder="Enter Your Question"></textarea>
            </div>
            <div class="answer-container">
                <label>Answer:</label>
                <textarea placeholder="Enter Your Answer"></textarea>
            </div>
            <button class="delete-card">✖</button>
        `;

        const deleteButton = flashcard.querySelector(".delete-card");
        deleteButton.addEventListener("click", () => deleteFlashcard(flashcard));

        flashcardContainer.appendChild(flashcard);
    }

    // Function to delete a flashcard
    function deleteFlashcard(flashcard) {
        const flashcards = Array.from(flashcardContainer.children);

        if (flashcards.length > 1 && flashcards[0] === flashcard) {
            // If deleting the first flashcard, copy the second card’s content into it
            const secondFlashcard = flashcards[1];

            flashcards[0].querySelector(".question-container textarea").value =
                secondFlashcard.querySelector(".question-container textarea").value;
            flashcards[0].querySelector(".answer-container textarea").value =
                secondFlashcard.querySelector(".answer-container textarea").value;

            // Remove the second flashcard
            secondFlashcard.remove();
        } else if (flashcards.length > 1) {
            // Remove the selected flashcard normally
            flashcard.remove();
        } else {
            // If it's the only flashcard, reset it instead of deleting
            flashcard.querySelector(".question-container textarea").value = "";
            flashcard.querySelector(".answer-container textarea").value = "";
        }

        updateCardNumbers();
    }

    // Function to update card numbers after adding/removing
    function updateCardNumbers() {
        document.querySelectorAll(".flashcard").forEach((card, index) => {
            card.querySelector(".card-number").textContent = index + 1;
        });
    }

    // Event Listener for Adding a New Flashcard
    addCardBtn.addEventListener("click", () => {
        const newFlashcard = createFlashcard(flashcardContainer.children.length + 1);
        flashcardContainer.appendChild(newFlashcard);
        updateCardNumbers();
    });

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

    window.saveFlashcardSet = function (isPublic) {
        console.log("Saving flashcard set...", isPublic);
    
        const setTitle = document.querySelector(".set-title").value.trim();
        const classCode = document.querySelector(".class-code").value.trim();
    
        if (!setTitle || !classCode) {
            alert("Please provide a title and class code.");
            return;
        }
    
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
    
        let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
        let editingSet = JSON.parse(localStorage.getItem("editingFlashcardSet"));


        if (editingaSet) {
            let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
            let editingSet = JSON.parse(localStorage.getItem("editingFlashcardSet"));
            console.log(editingSet);

            if (!editingSet || !editingSet.id) {
                console.warn("⚠ No editing set found or missing ID.");
                return;
            }

            // ✅ Find the index of the set with the same ID
            let setIndex = savedSets.findIndex(set => set.id === editingSet.id);

            if (setIndex !== -1) {
                // ✅ Extract updated values from HTML
            let updatedTitle = document.querySelector(".set-title").value.trim();
            let updatedClassCode = document.querySelector(".class-code").value.trim();

            // ✅ Extract updated flashcards
            let updatedFlashcards = [];
            document.querySelectorAll(".flashcard").forEach((card) => {
                let question = card.querySelector(".question-container textarea").value.trim();
                let answer = card.querySelector(".answer-container textarea").value.trim();

                // ✅ Update `editingSet` with the new values
            editingSet.title = updatedTitle;
            editingSet.classCode = updatedClassCode;
            editingSet.flashcards = updatedFlashcards;
            editingSet.numCards = updatedFlashcards.length; // ✅ Update flashcard count

            if (question || answer) {  // ✅ Ensure at least one field is filled
                updatedFlashcards.push({ question, answer });
            }
        });

        // ✅ Update `editingSet` with the new values
        editingSet.title = updatedTitle;
        editingSet.classCode = updatedClassCode;
        editingSet.flashcards = updatedFlashcards;
        editingSet.numCards = updatedFlashcards.length; // ✅ Update flashcard count
                console.log(`✅ Found and updating set at index: ${setIndex}`);

                // ✅ Update the saved set with the new values
                savedSets[setIndex].title = editingSet.title;
                savedSets[setIndex].classCode = editingSet.classCode;
                savedSets[setIndex].flashcards = editingSet.flashcards;
                savedSets[setIndex].numCards = editingSet.flashcards.length; // ✅ Update the card count

                // ✅ Save the updated sets back to localStorage
                localStorage.setItem("flashcardSets", JSON.stringify(savedSets));
                console.log("✅ Flashcard set updated successfully:", savedSets[setIndex]);
            } else {
                console.warn("⚠ Editing set not found in saved sets.");
            }
        } else {
            console.log("Creating a new flashcard set");
            createNewFlashcardSet(setTitle, classCode, flashcards, isPublic, icon);
        }


    
        window.location.href = "../dashboard/created_sets.html";
    };
    
    // ✅ Function to create a new flashcard set
    function createNewFlashcardSet(title, classCode, flashcards, isPublic, icon) {
        let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
        const newFlashcardSet = {
            id: crypto.randomUUID(), // ✅ Generate a unique ID for the new set
            title: title,
            classCode: classCode,
            numCards: flashcards.length,
            flashcards: flashcards,
            isPublic: isPublic,
            icon: icon
        };
    
        savedSets.push(newFlashcardSet);
        localStorage.setItem("flashcardSets", JSON.stringify(savedSets));
        console.log("New flashcard set saved:", newFlashcardSet);
    }
    
    
    
    
});
