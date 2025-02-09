document.addEventListener("DOMContentLoaded", () => {
    const flashcardContainer = document.getElementById("flashcard-list");
    const addCardBtn = document.getElementById("add-card-btn");




    // Function to create a new flashcard
    function createFlashcard(number) {
        const flashcard = document.createElement("div");
        flashcard.classList.add("flashcard");

        // Card Number
        const cardNumber = document.createElement("span");
        cardNumber.classList.add("card-number");
        cardNumber.textContent = number;

        // Question Container
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("question-container");

        const questionLabel = document.createElement("label");
        questionLabel.textContent = "Question:";

        const questionTextarea = document.createElement("textarea");
        questionTextarea.placeholder = "Enter Your Question";

        questionContainer.appendChild(questionLabel);
        questionContainer.appendChild(questionTextarea);

        // Answer Container
        const answerContainer = document.createElement("div");
        answerContainer.classList.add("answer-container");

        const answerLabel = document.createElement("label");
        answerLabel.textContent = "Answer:";

        const answerTextarea = document.createElement("textarea");
        answerTextarea.placeholder = "Enter Your Answer";

        answerContainer.appendChild(answerLabel);
        answerContainer.appendChild(answerTextarea);

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-card");
        deleteButton.innerHTML = "✖";
        
        deleteButton.addEventListener("click", () => {
            flashcard.remove();
            updateCardNumbers();
        });

        // Append elements to flashcard
        flashcard.appendChild(cardNumber);
        flashcard.appendChild(questionContainer);
        flashcard.appendChild(answerContainer);
        flashcard.appendChild(deleteButton);

        return flashcard;
    }

    // Function to update card numbers after adding/removing
    function updateCardNumbers() {
        const flashcards = document.querySelectorAll(".flashcard");
        flashcards.forEach((card, index) => {
            card.querySelector(".card-number").textContent = index + 1; // Reassign numbers correctly
        });
    }

    // Event Listener for Adding a New Flashcard
    addCardBtn.addEventListener("click", () => {
        const newCardNumber = flashcardContainer.children.length + 1;
        const newFlashcard = createFlashcard(newCardNumber);
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

            // If missing required fields, show an alert instead of navigating
            if (!setTitle || !classCode) {
                alert("Please provide a title and class code.");
                return; // Stop the function, do not navigate
            }
            saveFlashcardSet(false);
            window.location.href = destination; // Navigate to the clicked link
        });

        document.querySelector(".exit-no-save").addEventListener("click", () => {
            window.location.href = destination; // Navigate without saving
        });

        document.querySelector(".cancel").addEventListener("click", () => {
            modal.remove(); // Close modal without leaving
        });
    }



    window.saveFlashcardSet = function(isPublic) {
        console.log("Saving flashcard set...", isPublic);  // Debugging check
    
        // Get Set Title & Class Code
        const setTitle = document.querySelector(".set-title").value.trim();
        const classCode = document.querySelector(".class-code").value.trim();
    
        if (!setTitle || !classCode) {
            alert("Please provide a title and class code.");
            return;
        }
    
        // Get all flashcards
        const flashcards = [];
        document.querySelectorAll(".flashcard").forEach((card) => {
            const question = card.querySelector(".question-container textarea").value.trim();
            const answer = card.querySelector(".answer-container textarea").value.trim();
    
            if (question && answer) {
                flashcards.push({ question, answer });
            }
        });
    
        if (flashcards.length === 0) {
            alert("You need to add at least one flashcard.");
            return;
        }
    
        // Choose icon based on public/private status
        const icon = isPublic ? "../../FliplyPNGs/public flashcard icon.png" : "../../FliplyPNGs/private flashcard.png";
    
        // Create Flashcard Set Object
        const flashcardSet = {
            title: setTitle,
            classCode: classCode,
            numCards: flashcards.length,
            isPublic: isPublic,
            icon: icon
        };
    
        // Store in Local Storage (simulating database storage)
        let savedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
        savedSets.push(flashcardSet);
        localStorage.setItem("flashcardSets", JSON.stringify(savedSets));
    
        console.log("Flashcard set saved:", flashcardSet);  // Debugging check
    
        // Redirect back to Created Sets Page
        window.location.href = "../dashboard/created_sets.html";
    };
    
    
});
