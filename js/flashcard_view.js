// Retrieve flashcards from localStorage
let flashcards = JSON.parse(localStorage.getItem("viewingFlashcardSet"))?.flashcards || [];
let shuffledCards = [...flashcards];
let currentIndex = 0;
let showingQuestion = true; // Tracks whether question or answer is displayed

// DOM Elements
const flashcardText = document.getElementById("flashcard-text");
const cardCounter = document.getElementById("card-counter");
const flashcard = document.getElementById("flashcard");

// Load first card
if (shuffledCards.length > 0) {
    displayCard();
}

// Back button - Save state and return
document.querySelector(".back-button").addEventListener("click", function (event) {
    event.preventDefault();
    let viewingSet = JSON.parse(localStorage.getItem("viewingFlashcardSet")) || {};
    viewingSet.flashcards = flashcards;
    localStorage.setItem("viewingFlashcardSet", JSON.stringify(viewingSet));
    window.location.href = "../flashcard_using/set_viewing.html";
});

// Function to display current flashcard
function displayCard() {
    if (shuffledCards.length === 0) {
        flashcardText.textContent = "No flashcards available.";
        return;
    }
    let card = shuffledCards[currentIndex];

    // Smoothly update content after animation
    setTimeout(() => {
        flashcardText.textContent = showingQuestion ? card.question : card.answer;
        cardCounter.textContent = `${currentIndex + 1} / ${shuffledCards.length}`;
        flashcard.classList.remove("slide-left", "slide-right");
    }, 200);
}

function flipCard() {
    flashcard.classList.add("flipping"); // Hide text

    setTimeout(() => {
        showingQuestion = !showingQuestion;
        displayCard(); // Change text while hidden
    }, 100); // Hide text slightly before flip

    setTimeout(() => {
        flashcard.classList.toggle("flipped"); // Apply flip animation
    }, 150); // Start flipping after text disappears

    setTimeout(() => {
        flashcard.classList.remove("flipping"); // Show text again
    }, 300); // Reveal text after flip completes
}


// Next card with sliding effect
function nextCard() {
    if (currentIndex < shuffledCards.length - 1) {
        flashcard.classList.add("slide-left");
        setTimeout(() => {
            currentIndex++;
            showingQuestion = true; // Reset to question
            displayCard();
        }, 300);
    }
}

// Previous card with sliding effect
function prevCard() {
    if (currentIndex > 0) {
        flashcard.classList.add("slide-right");
        setTimeout(() => {
            currentIndex--;
            showingQuestion = true; // Reset to question
            displayCard();
        }, 300);
    }
}

// Shuffle flashcards (like Quizlet's shuffle feature)
function shuffleCards() {
    shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    showingQuestion = true; // Reset to question
    displayCard();
}
