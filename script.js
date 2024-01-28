const levels = {
    easy: [
        "TADPOLE", "LION", "MANILA", "SPIDERS", "SKULL", "THREE", "MILK", "PACIFIC", "SKIN", "SAMPAGUITA"
    ],
    difficult: [
        "PYTHON", "JAVASCRIPT", "HTML", "CSS", "DATABASE", "FRAMEWORK", "DEVELOPMENT", "INTERFACE", "CODING", "DEBUGGING"
    ],
    expert: [
        "EXTRAVAGANZA", "JUBILATION", "QUINTESSENTIAL", "SERENDIPITY", "ELOQUENT", "EFFERVESCENT", "MAGNIFICENT", "PHENOMENAL", "QUINTESSENTIAL", "PERSEVERANCE"
    ]
};




let secretWord = "";
let guessWord = [];
let incorrectGuesses = 0;
let points = 0;
let cluesUsed = 0;
let currentLevel = "easy";
let currentQuestionIndex = 0;

function chooseWord() {
    const levelWords = levels[currentLevel];
    return levelWords[currentQuestionIndex].split("");
}

function initializeGame() {
    secretWord = chooseWord();
    guessWord = Array(secretWord.length).fill("_");
    incorrectGuesses = 0;
    points = 0;
    cluesUsed = 0;
    updateDisplay();
}

function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = guessWord.map(letter => `<span>${letter}</span>`).join('');
    updateLetterButtons();
    document.getElementById('points').innerText = `Points: ${points}`;
}

function updateLetterButtons() {
    const letterButtonsContainer = document.getElementById('letter-buttons');
    letterButtonsContainer.innerHTML = "";

    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.innerText = letter;
        button.className = 'button';
        button.onclick = function() { checkGuess(letter); };
        letterButtonsContainer.appendChild(button);
    }

    const clueButton = document.getElementById('clue-button');
    clueButton.onclick = function() { getClue(); };
}
function updateGuessButtons() {
    const guessButtons = document.querySelectorAll('.guess-button');
    for (let i = 0; i < guessButtons.length; i++) {
        if (i < incorrectGuesses) {
            guessButtons[i].classList.add('highlighted');
        } else {
            guessButtons[i].classList.remove('highlighted');
        }
    }
}

function checkGuess(guess) {
    let newGuess = false;

    if (secretWord.includes(guess)) {
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === guess && guessWord[i] !== guess) {
                guessWord[i] = guess;
                newGuess = true;
            }
        }
    } else {
      
        if (!guessWord.includes(guess)) {
            incorrectGuesses++;
        }
    }

    updateDisplay();  
    updateGuessButtons();
    checkGameStatus();
}

function getClue() {
    if (cluesUsed < 3 && points >= 25) {
        const unrevealedIndex = guessWord.findIndex(letter => letter === '_');
        if (unrevealedIndex !== -1) {
            const isConsonant = Math.random() < 0.5; 
            if (isConsonant) {
                guessWord[unrevealedIndex] = revealConsonant(secretWord[unrevealedIndex]);
            } else {
                guessWord[unrevealedIndex] = revealVowel(secretWord[unrevealedIndex]);
            }
            points -= 25;
            cluesUsed++;
            displayMessage(`Clue revealed! You have earned a clue for 25 points.`);
            updateDisplay(); 
        }
    } else {
        const message = cluesUsed >= 3 ? "You've already used all your clues." : "You don't have enough points for a clue.";
        displayMessage(message);
    }
}


function revealConsonant(letter) {
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
    const remainingConsonants = [...consonants].filter(c => c !== letter);
    return remainingConsonants[Math.floor(Math.random() * remainingConsonants.length)];
}

function revealVowel(letter) {
    const vowels = "AEIOU";
    const remainingVowels = [...vowels].filter(v => v !== letter);
    return remainingVowels[Math.floor(Math.random() * remainingVowels.length)];
}

function checkGameStatus() {
    if (!guessWord.includes('_')) {
        points += 10; 
        displayMessage(`Congratulations! You guessed the word. You earned 10 points.`);
        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            secretWord = chooseWord();
            guessWord = Array(secretWord.length).fill("_");
            incorrectGuesses = 0;
            updateDisplay();
        } else {
            displayMessage(`You've completed all questions for ${currentLevel} level! You earned ${points} points.`);
        }
    } else if (incorrectGuesses >= 3) {
        displayMessage(`Game over! The word was ${secretWord.join('')}. You earned 0 points.`);
        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            secretWord = chooseWord();
            guessWord = Array(secretWord.length).fill("_");
            incorrectGuesses = 0;
            updateDisplay();
        } else {
            displayMessage(`You've completed all questions for ${currentLevel} level! You earned ${points} points.`);
        }
    }
}


function displayMessage(message) {
    document.getElementById('message').innerText = message;
    document.getElementById('letter-buttons').innerHTML = "";
}

function setLevel(level) {
    currentLevel = level;
    currentQuestionIndex = 0;
    initializeGame();
}


initializeGame();
