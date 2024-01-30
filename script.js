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
        button.onclick = function () { checkGuess(letter); };
        
        
        if (guessWord.includes(letter)) {
            button.disabled = true;
        }

        letterButtonsContainer.appendChild(button);
    }

    const clueButton = document.getElementById('clue-button');
    clueButton.onclick = function () { getClue(); };
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
            guessWord[unrevealedIndex] = secretWord[unrevealedIndex];
            points -= 25;
            cluesUsed++;
            displayMessage(`Clue revealed! You have earned a clue for 25 points.`);
        }
    } else {
        const message = cluesUsed >= 3 ? "You've already used all your clues." : "You don't have enough points for a clue.";
        displayMessage(message);
    }
    updateDisplay();
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

//function that fetches question .txt files from server
function getQuestions(){
	//create promise block
	Promise.all([
	//fetch all files from server
	fetch('/easy.txt').then(x => x.text()),
	fetch('/hard.txt').then(x => x.text()),
	fetch('/expert.txt').then(x => x.text())
	
	//shorthand function that takes response objects (easy.txt, hard.txt, expert.txt) 
	//and respectively passes them to parameters easy, hard, expert
	]).then(([easy, hard, expert]) => { 
		//declare 3 constant variables with values of respective text files in array form, delimited with next-line (\n) character
		const easyQlines = easy.split('\n'),
		hardQlines = hard.split('\n'),
		expertQlines = expert.split('\n');	
		//log to console for debugging
		console.log('Easy file contents:', easyQlines);
		console.log('Hard file content:', hardQlines);
		console.log('Expert file content:', expertQlines);
		
		//return array of arrays to function caller
		//use in returning function as:
		//const questions = getQuestions();
		//easyLines = questions[0]
		//hardLines = questions[1]
		//expertLines = questions[2]
		//manipulate data from returning function
		return [easyQlines, hardQlines, expertQlines];
	})
	
}


initializeGame();
