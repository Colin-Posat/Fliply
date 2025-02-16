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

// Function to display current flashcard
function displayCard() {
    if (shuffledCards.length === 0) {
        flashcardText.textContent = "No flashcards available.";
        return;
    }
    let card = shuffledCards[currentIndex];
    flashcardText.textContent = showingQuestion ? card.question : card.answer;
    cardCounter.textContent = `${currentIndex + 1} / ${shuffledCards.length}`;
}

// Flip flashcard (toggles question ↔ answer)
function flipCard() {
    showingQuestion = !showingQuestion;
    displayCard();
}



// Next card
function nextCard() {
    if (currentIndex < shuffledCards.length - 1) {
        currentIndex++;
        showingQuestion = true; // Reset to question
        displayCard();
    }
}

// Previous card
function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
        showingQuestion = true; // Reset to question
        displayCard();
    }
}

// Shuffle flashcards
function shuffleCards() {
    shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    showingQuestion = true; // Reset to question
    displayCard();
}
