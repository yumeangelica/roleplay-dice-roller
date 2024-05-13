// Element selection and initial state setup
let maxDiceNumber = 2;
let showSecondDice = false;
let roundCounter = 0;

document.getElementById('firstDice').textContent = '';
document.getElementById('secondDice').textContent = '';
document.getElementById('firstDiceInput').value = '';
document.getElementById('secondDiceInput').value = '';
document.getElementById('firstDiceInput').focus();

// Function to add a second dice
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

// Function to remove the second dice
const subDice = () => {
  resetInputTwo();
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

// Function to handle dice rolling
const rollDice = () => {
  let n1 = document.getElementById('firstDiceInput').value.trim();
  let n2 = document.getElementById('secondDiceInput').value.trim();


  if (validateInput(n1, n2)) {  // Only proceed if the input is valid
    document.getElementById('currentRoundDisplay').style.display = 'inline';
    calculateAndDisplayResults(n1, n2);
  }
};

// Validates the input and handles related alerts
const validateInput = (n1, n2) => {
  let inputValid = true;

  if (n1 === '' || isNaN(n1) || n1 < 1 || n1 > 20) {
    alert('Please enter a number between 1-20 for the first dice.');
    resetInputOne();
    inputValid = false;
    document.getElementById('firstDiceInput').focus();
  }

  // Check for the second dice only if it is active
  if (showSecondDice && (n2 === '' || isNaN(n2) || n2 < 1 || n2 > 20)) {
    alert('Please enter a number between 1-20 for the second dice.');
    resetInputTwo();
    inputValid = false;
    document.getElementById('secondDiceInput').focus();
  }

  return inputValid;  // Return the validation result
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

// Reset input fields
const resetInputOne = () => {
  document.getElementById('firstDiceInput').value = '';
  document.getElementById('firstDice').textContent = '';
};

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

// Event listeners for enter key
document.getElementById('firstDiceInput').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    document.getElementById('rollButton').click();
  }
});

document.getElementById('secondDiceInput').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    document.getElementById('rollButton').click();
  }
});