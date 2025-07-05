// Element selection and initial state setup
let maxDiceNumber = 2;
let showSecondDice = false;
let roundCounter = 0;

/**
 * Initialize the application when DOM content is loaded
 * Sets up initial state and event listeners for all interactive elements
 * @param {Event} event - The DOMContentLoaded event
 */
document.addEventListener('DOMContentLoaded', (event) => {
  // Initialize dice and input fields
  document.getElementById('firstDice').textContent = '';
  document.getElementById('secondDice').textContent = '';
  document.getElementById('firstDiceInput').value = '';
  document.getElementById('secondDiceInput').value = '';
  document.getElementById('firstDiceSelect').focus();

  showCopyRight(); // Display copyright information

  // Add event listeners to buttons
  document.getElementById('rollButton').addEventListener('click', rollDice);
  document.getElementById('addButton').addEventListener('click', addDice);
  document.getElementById('subButton').addEventListener('click', subDice);
  document.getElementById('resetButton').addEventListener('click', reset);

  // Event listeners for dropdown changes
  document.getElementById('firstDiceSelect').addEventListener('change', handleFirstDiceSelectChange);
  document.getElementById('secondDiceSelect').addEventListener('change', handleSecondDiceSelectChange);

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

/**
 * Add second dice functionality
 * Displays the second dice input and related elements.
 * Hides the add button and shows the subtract button.
 * Sets focus to the second dice input field.
 */
const addDice = () => {
  const secondDice = document.getElementById('secondDice');
  secondDice.style.display = 'flex';
  secondDice.classList.add('show');
  document.getElementById('subButton').style.display = 'inline';
  document.getElementById('secondDiceSelect').style.display = 'block';
  document.getElementById('secondDiceInput').style.display = 'none';
  document.getElementById('secondDiceInputContainer').style.display = 'flex';
  document.getElementById('addButton').style.display = 'none';
  showSecondDice = true;
  document.getElementById('totalSumDisplay').style.display = 'inline';
  document.getElementById('secondDiceSelectLabel').style.display = 'block';
  document.getElementById('secondDiceSelect').focus();
};

/**
 * Subtract second dice functionality
 * Hides the second dice input and related elements.
 * Resets the second dice input and shows the add button.
 * The total sum display is hidden, and focus is set back to the first dice input.
 */
const subDice = () => {
  resetInputTwo(); // Reset and hide second dice and related input elements
  const secondDice = document.getElementById('secondDice');
  secondDice.style.display = 'none';
  secondDice.classList.remove('show');
  document.getElementById('addButton').style.display = 'inline';
  document.getElementById('subButton').style.display = 'none';
  document.getElementById('secondDiceSelect').style.display = 'none';
  document.getElementById('secondDiceInput').style.display = 'none';
  document.getElementById('secondDiceInputContainer').style.display = 'none';
  showSecondDice = false;
  document.getElementById('totalSumDisplay').style.display = 'none';
  document.getElementById('secondDiceSelectLabel').style.display = 'none';
  document.getElementById('firstDiceSelect').focus();
};

/**
 * Roll dice functionality
 * Retrieves the values from the input fields, validates them, and calculates the results.
 * Updates the UI with the current round number, dice results, and total sum.
 * If the input is invalid, it shows an alert and resets the relevant input field.
 */
const rollDice = () => {
  const n1 = getDiceValue('first');
  const n2 = showSecondDice ? getDiceValue('second') : 0;

  if (validateInput(n1, n2)) {  // Only proceed if the input is valid
    document.getElementById('currentRoundDisplay').style.display = 'inline';
    calculateAndDisplayResults(n1, n2);
  }
};

/**
 * Validate the input values for dice
 * Checks if the input values are valid numbers between 1-999
 * Shows appropriate alerts and resets inputs if validation fails
 * @param {number} n1 - The first dice input value
 * @param {number} n2 - The second dice input value
 * @returns {boolean} True if all inputs are valid, false otherwise
 */
const validateInput = (n1, n2) => {
  let inputValid = true;

  // Check first dice
  if (n1 === 0 || isNaN(n1) || n1 < 1 || n1 > 999) {
    const firstSelect = document.getElementById('firstDiceSelect');
    if (firstSelect.value === 'custom') {
      alert('Please enter a number between 1-999 for the first dice.');
      resetInputOne();
      document.getElementById('firstDiceInput').focus();
    } else {
      alert('Please select a valid dice type for the first dice.');
      firstSelect.focus();
    }
    inputValid = false;
  }

  // Check second dice if visible
  if (showSecondDice && (n2 === 0 || isNaN(n2) || n2 < 1 || n2 > 999)) {
    const secondSelect = document.getElementById('secondDiceSelect');
    if (secondSelect.value === 'custom') {
      alert('Please enter a number between 1-999 for the second dice.');
      resetInputTwo();
      document.getElementById('secondDiceInput').focus();
    } else {
      alert('Please select a valid dice type for the second dice.');
      secondSelect.focus();
    }
    inputValid = false;
  }

  return inputValid;
};

/**
 * Calculate dice results and update the UI
 * Generates random numbers for each dice based on input values
 * Updates the display with dice results, round counter, and sum
 * @param {string} n1 - The number of sides for the first dice
 * @param {string} n2 - The number of sides for the second dice
 */
const calculateAndDisplayResults = (n1, n2) => {
  const d1 = n1 ? Math.floor(Math.random() * n1) + 1 : '';
  const d2 = n2 && showSecondDice ? Math.floor(Math.random() * n2) + 1 : '';

  roundCounter++;
  document.getElementById('currentRoundDisplay').textContent = 'Round: ' + roundCounter;
  document.getElementById('firstDice').textContent = d1;
  document.getElementById('secondDice').textContent = d2;

  const sum = (d1 || 0) + (d2 || 0);
  document.getElementById('totalSumDisplay').textContent = 'Sum of dices: ' + sum;
};

/**
 * Reset input field and display for the first dice
 * Clears the input value, resets dropdown to D20, and hides custom input
 */
const resetInputOne = () => {
  document.getElementById('firstDiceInput').value = '';
  document.getElementById('firstDiceSelect').value = '20';
  document.getElementById('firstDiceInput').style.display = 'none';
  document.getElementById('firstDice').textContent = '';
};

/**
 * Reset input field and display for the second dice
 * Clears the input value, resets dropdown to D20, and hides custom input
 */
const resetInputTwo = () => {
  document.getElementById('secondDiceInput').value = '';
  document.getElementById('secondDiceSelect').value = '20';
  document.getElementById('secondDiceInput').style.display = 'none';
  document.getElementById('secondDice').textContent = '';
};

/**
 * Reset the entire application to initial state
 * Shows a confirmation dialog before reloading the page
 * Resets all dice, counters, and input fields
 */
const reset = () => {
  if (confirm('Are you sure you want to reset?')) {
    location.reload();
  }
};

/**
 * Handle first dice select dropdown change
 * Shows/hides custom input based on selection
 */
const handleFirstDiceSelectChange = () => {
  const select = document.getElementById('firstDiceSelect');
  const input = document.getElementById('firstDiceInput');

  if (select.value === 'custom') {
    input.style.display = 'block';
    input.focus();
  } else {
    input.style.display = 'none';
    input.value = '';
  }
};

/**
 * Handle second dice select dropdown change
 * Shows/hides custom input based on selection
 */
const handleSecondDiceSelectChange = () => {
  const select = document.getElementById('secondDiceSelect');
  const input = document.getElementById('secondDiceInput');

  if (select.value === 'custom') {
    input.style.display = 'block';
    input.focus();
  } else {
    input.style.display = 'none';
    input.value = '';
  }
};

/**
 * Get the dice value from either dropdown or custom input
 * @param {string} diceNumber - 'first' or 'second'
 * @returns {number} The dice value
 */
const getDiceValue = (diceNumber) => {
  const select = document.getElementById(diceNumber + 'DiceSelect');
  const input = document.getElementById(diceNumber + 'DiceInput');

  if (select.value === 'custom') {
    return parseInt(input.value) || 0;
  }

  return parseInt(select.value) || 0;
};
