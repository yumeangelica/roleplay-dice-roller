// Element selection and initial state setup
let maxDiceNumber = 2;
let showSecondDice = false;
let roundCounter = 0;

document.addEventListener('DOMContentLoaded', (event) => {
  // Initialize dice and input fields
  document.getElementById('firstDice').textContent = '';
  document.getElementById('secondDice').textContent = '';
  document.getElementById('firstDiceInput').value = '';
  document.getElementById('secondDiceInput').value = '';
  document.getElementById('firstDiceInput').focus();

  showCopyRight(); // Display copyright information

  // Add event listeners to buttons
  document.getElementById('rollButton').addEventListener('click', rollDice);
  document.getElementById('addButton').addEventListener('click', addDice);
  document.getElementById('subButton').addEventListener('click', subDice);
  document.getElementById('resetButton').addEventListener('click', reset);

  // Event listeners for the Enter key on the input fields
  document.getElementById('firstDiceInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      rollDice();
    }
  });

  document.getElementById('secondDiceInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      rollDice();
    }
  });
});

// Add a second dice
const addDice = () => {
  document.getElementById('secondDice').style.display = 'inline';
  document.getElementById('subButton').style.display = 'inline';
  document.getElementById('secondDiceInput').style.display = 'inline';
  document.getElementById('secondDiceInputContainer').style.display = 'inline';
  document.getElementById('addButton').style.display = 'none';
  showSecondDice = true;
  document.getElementById('totalSumDisplay').style.display = 'inline';
  document.getElementById('secondDiceInputLabel').style.display = 'block';
  document.getElementById('secondDiceInput').focus();
};

// Remove the second dice
const subDice = () => {
  resetInputTwo(); // Reset and hide second dice and related input elements
  document.getElementById('secondDice').style.display = 'none';
  document.getElementById('addButton').style.display = 'inline';
  document.getElementById('subButton').style.display = 'none';
  document.getElementById('secondDiceInput').style.display = 'none';
  document.getElementById('secondDiceInputContainer').style.display = 'none';
  showSecondDice = false;
  document.getElementById('totalSumDisplay').style.display = 'none';
  document.getElementById('secondDiceInputLabel').style.display = 'none';
  document.getElementById('firstDiceInput').focus();
};

// Handle dice rolling
const rollDice = () => {
  let n1 = document.getElementById('firstDiceInput').value.trim();
  let n2 = document.getElementById('secondDiceInput').value.trim();

  if (validateInput(n1, n2)) {  // Only proceed if the input is valid
    document.getElementById('currentRoundDisplay').style.display = 'inline';
    calculateAndDisplayResults(n1, n2);
  }
};

// Validate the input and handle related alerts
const validateInput = (n1, n2) => {
  let inputValid = true;

  if (n1 === '' || isNaN(n1) || n1 < 1 || n1 > 20) {
    alert('Please enter a number between 1-20 for the first dice.');
    resetInputOne(); // Reset the first dice input
    inputValid = false;
    document.getElementById('firstDiceInput').focus();
  }

  if (showSecondDice && (n2 === '' || isNaN(n2) || n2 < 1 || n2 > 20)) {
    alert('Please enter a number between 1-20 for the second dice.');
    resetInputTwo(); // Reset the second dice input
    inputValid = false;
    document.getElementById('secondDiceInput').focus();
  }

  return inputValid;
};

// Calculate dice results and update the UI
const calculateAndDisplayResults = (n1, n2) => {
  if (!validateInput(n1, n2)) return;

  let d1 = n1 ? Math.floor(Math.random() * n1) + 1 : '';
  let d2 = n2 && showSecondDice ? Math.floor(Math.random() * n2) + 1 : '';

  roundCounter++;
  document.getElementById('currentRoundDisplay').textContent = 'Round: ' + roundCounter;
  document.getElementById('firstDice').textContent = d1;
  document.getElementById('secondDice').textContent = d2;

  let sum = (d1 || 0) + (d2 || 0);
  document.getElementById('totalSumDisplay').textContent = 'Sum of dices: ' + sum;
};

// Reset input fields for the first dice
const resetInputOne = () => {
  document.getElementById('firstDiceInput').value = '';
  document.getElementById('firstDice').textContent = '';
};

// Reset input fields for the second dice
const resetInputTwo = () => {
  document.getElementById('secondDiceInput').value = '';
  document.getElementById('secondDice').textContent = '';
};

// Reset function to reload the page
const reset = () => {
  if (confirm('Are you sure you want to reset?')) {
    location.reload();
  }
};
