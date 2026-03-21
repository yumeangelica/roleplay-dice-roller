/**
 * Dice Roller — 2026 Modernized
 * Vanilla JS, no frameworks
 * Note: Footer copyright is handled by copyright.js
 */

// ---- State ----
let showSecondDice = false;
let roundCounter = 0;

// ---- DOM refs (cached once) ----
const $ = (id) => document.getElementById(id);

let els; // populated on DOMContentLoaded

// ---- Helpers ----

/** Crypto-quality random integer 1…max */
const rollRandom = (max) => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % max) + 1;
};

/** Clear validation state from an element */
const clearValidation = (el) => {
  el.classList.remove('invalid');
  const msg = el.closest('#firstDiceInputContainer, #secondDiceInputContainer')
    ?.querySelector('.validation-msg');
  if (msg) msg.textContent = '';
};

/** Show inline validation error */
const showValidationError = (el, message) => {
  el.classList.add('invalid');
  const container = el.closest('#firstDiceInputContainer, #secondDiceInputContainer');
  let msg = container?.querySelector('.validation-msg');
  if (!msg && container) {
    msg = document.createElement('span');
    msg.className = 'validation-msg';
    container.appendChild(msg);
  }
  if (msg) msg.textContent = message;

  // Auto-clear after 2.5s
  setTimeout(() => clearValidation(el), 2500);
};

/**
 * Trigger 3D tumble animation on a dice element.
 * Clears text during tumble, then shows result with a pop-in.
 */
const animateDice = (diceEl, result) => {
  // Remove any lingering animation classes
  diceEl.classList.remove('rolling', 'result-pop');
  diceEl.textContent = '';

  // Force reflow so re-adding the class restarts the animation
  void diceEl.offsetWidth;

  // Start tumble
  diceEl.classList.add('rolling');

  // When tumble ends → show result with pop
  diceEl.addEventListener('animationend', function onTumbleEnd() {
    diceEl.removeEventListener('animationend', onTumbleEnd);
    diceEl.classList.remove('rolling');

    // Set result and do pop-in
    diceEl.textContent = result;
    void diceEl.offsetWidth;
    diceEl.classList.add('result-pop');

    diceEl.addEventListener('animationend', function onPopEnd() {
      diceEl.removeEventListener('animationend', onPopEnd);
      diceEl.classList.remove('result-pop');
    });
  });
};

/** Animate counter badge update */
const animateCounter = (el) => {
  el.classList.remove('updated');
  void el.offsetWidth;
  el.classList.add('updated');
};

// ---- Dice value logic ----

const getDiceValue = (prefix) => {
  const select = $(prefix + 'DiceSelect');
  const input = $(prefix + 'DiceInput');

  if (select.value === 'custom') {
    return parseInt(input.value, 10) || 0;
  }
  return parseInt(select.value, 10) || 0;
};

const validateDice = (prefix) => {
  const value = getDiceValue(prefix);

  if (value >= 1 && value <= 999) return value;

  // Only custom input can be invalid
  const input = $(prefix + 'DiceInput');
  const label = prefix === 'first' ? 'First' : 'Second';
  showValidationError(input, `${label}: 1–999`);
  input.focus();
  return null;
};

// ---- Core actions ----

const rollDice = () => {
  const n1 = validateDice('first');
  if (n1 === null) return;

  let n2 = 0;
  if (showSecondDice) {
    n2 = validateDice('second');
    if (n2 === null) return;
  }

  // Show round display
  els.currentRound.style.display = 'inline';

  // Generate results
  const d1 = rollRandom(n1);
  const d2 = showSecondDice ? rollRandom(n2) : null;

  roundCounter++;

  // Animate dice with tumble → result pop sequence
  animateDice(els.firstDice, d1);
  if (showSecondDice) {
    animateDice(els.secondDice, d2);
  }

  // Update counters (with a slight delay to sync with dice animation)
  setTimeout(() => {
    els.currentRound.textContent = 'Round: ' + roundCounter;
    animateCounter(els.currentRound);

    if (showSecondDice && d2 !== null) {
      els.totalSum.textContent = 'Sum of dices: ' + (d1 + d2);
      animateCounter(els.totalSum);
    }
  }, 650);
};

const addDice = () => {
  els.secondDice.classList.add('show');
  $('subButton').style.display = 'inline';
  $('secondDiceSelect').style.display = 'block';
  $('secondDiceInput').style.display = 'none';
  $('secondDiceInputContainer').style.display = 'flex';
  $('addButton').style.display = 'none';
  $('secondDiceSelectLabel').style.display = 'block';
  els.totalSum.style.display = 'inline';
  showSecondDice = true;
  $('secondDiceSelect').focus();
};

const subDice = () => {
  resetInputTwo();
  els.secondDice.classList.remove('show');
  $('addButton').style.display = 'inline';
  $('subButton').style.display = 'none';
  $('secondDiceSelect').style.display = 'none';
  $('secondDiceInput').style.display = 'none';
  $('secondDiceInputContainer').style.display = 'none';
  $('secondDiceSelectLabel').style.display = 'none';
  els.totalSum.style.display = 'none';
  showSecondDice = false;
  $('firstDiceSelect').focus();
};

const resetInputOne = () => {
  $('firstDiceInput').value = '';
  $('firstDiceSelect').value = '20';
  $('firstDiceInput').style.display = 'none';
  els.firstDice.textContent = '';
};

const resetInputTwo = () => {
  $('secondDiceInput').value = '';
  $('secondDiceSelect').value = '20';
  $('secondDiceInput').style.display = 'none';
  els.secondDice.textContent = '';
};

const resetAll = () => {
  if (roundCounter > 0 && !confirm('Are you sure you want to reset?')) return;

  roundCounter = 0;
  resetInputOne();
  resetInputTwo();

  if (showSecondDice) subDice();

  els.currentRound.style.display = 'none';
  els.currentRound.textContent = '';
  els.totalSum.style.display = 'none';
  els.totalSum.textContent = '';
  els.firstDice.classList.remove('rolling', 'result-pop');
  els.secondDice.classList.remove('rolling', 'result-pop');
  $('firstDiceSelect').focus();
};

// ---- Select change handlers ----

const handleSelectChange = (prefix) => {
  const select = $(prefix + 'DiceSelect');
  const input = $(prefix + 'DiceInput');

  clearValidation(select);
  clearValidation(input);

  if (select.value === 'custom') {
    input.style.display = 'block';
    input.focus();
  } else {
    input.style.display = 'none';
    input.value = '';
  }
};

// ---- Init ----

document.addEventListener('DOMContentLoaded', () => {
  // Cache elements
  els = {
    firstDice: $('firstDice'),
    secondDice: $('secondDice'),
    currentRound: $('currentRoundDisplay'),
    totalSum: $('totalSumDisplay'),
  };

  // Clear initial state
  els.firstDice.textContent = '';
  els.secondDice.textContent = '';
  $('firstDiceInput').value = '';
  $('secondDiceInput').value = '';
  $('firstDiceSelect').focus();

  // Button listeners
  $('rollButton').addEventListener('click', rollDice);
  $('addButton').addEventListener('click', addDice);
  $('subButton').addEventListener('click', subDice);
  $('resetButton').addEventListener('click', resetAll);

  // Select change listeners
  $('firstDiceSelect').addEventListener('change', () => handleSelectChange('first'));
  $('secondDiceSelect').addEventListener('change', () => handleSelectChange('second'));

  // Clear validation on input
  $('firstDiceInput').addEventListener('input', (e) => clearValidation(e.target));
  $('secondDiceInput').addEventListener('input', (e) => clearValidation(e.target));

  // Enter key → roll
  $('firstDiceInput').addEventListener('keyup', (e) => { if (e.key === 'Enter') rollDice(); });
  $('secondDiceInput').addEventListener('keyup', (e) => { if (e.key === 'Enter') rollDice(); });
});