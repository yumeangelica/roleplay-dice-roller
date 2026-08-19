(() => {
  'use strict';

  const UINT32_RANGE = 0x1_0000_0000;
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = {
    form: /** @type {HTMLFormElement} */ (document.getElementById('dice-form')),
    firstResult: /** @type {HTMLOutputElement} */ (document.getElementById('first-die-result')),
    secondResult: /** @type {HTMLOutputElement} */ (document.getElementById('second-die-result')),
    rollSummary: /** @type {HTMLDivElement} */ (document.getElementById('roll-summary')),
    roundOutput: /** @type {HTMLParagraphElement} */ (document.getElementById('round-output')),
    sumOutput: /** @type {HTMLParagraphElement} */ (document.getElementById('sum-output')),
    firstSelect: /** @type {HTMLSelectElement} */ (document.getElementById('first-die-select')),
    firstCustomField: /** @type {HTMLDivElement} */ (document.getElementById('first-custom-field')),
    firstCustom: /** @type {HTMLInputElement} */ (document.getElementById('first-custom-sides')),
    firstError: /** @type {HTMLParagraphElement} */ (document.getElementById('first-error')),
    secondConfig: /** @type {HTMLFieldSetElement} */ (document.getElementById('second-die-config')),
    secondSelect: /** @type {HTMLSelectElement} */ (document.getElementById('second-die-select')),
    secondCustomField: /** @type {HTMLDivElement} */ (document.getElementById('second-custom-field')),
    secondCustom: /** @type {HTMLInputElement} */ (document.getElementById('second-custom-sides')),
    secondError: /** @type {HTMLParagraphElement} */ (document.getElementById('second-error')),
    rollButton: /** @type {HTMLButtonElement} */ (document.getElementById('roll-button')),
    addButton: /** @type {HTMLButtonElement} */ (document.getElementById('add-die-button')),
    removeButton: /** @type {HTMLButtonElement} */ (document.getElementById('remove-die-button')),
    resetButton: /** @type {HTMLButtonElement} */ (document.getElementById('reset-button')),
    status: /** @type {HTMLParagraphElement} */ (document.getElementById('roll-status')),
    resetDialog: /** @type {HTMLDialogElement} */ (document.getElementById('reset-dialog')),
  };

  /**
   * @typedef {'first' | 'second'} DiePrefix
   * @typedef {{ round: number, firstResult: number, secondResult: number | null }} RollResult
   */

  /** @type {{ useSecondDie: boolean, round: number, rolling: boolean, revealTimeout: number | null, statusTimeout: number | null }} */
  const state = {
    useSecondDie: false,
    round: 0,
    rolling: false,
    revealTimeout: null,
    statusTimeout: null,
  };

  /** @param {string} message */
  const announce = (message) => {
    if (state.statusTimeout !== null) window.clearTimeout(state.statusTimeout);
    elements.status.textContent = '';
    state.statusTimeout = window.setTimeout(() => {
      elements.status.textContent = message;
    }, 10);
  };

  /** @param {number} maximum */
  const randomInteger = (maximum) => {
    const limit = Math.floor(UINT32_RANGE / maximum) * maximum;
    const values = new Uint32Array(1);
    let randomValue;

    do {
      crypto.getRandomValues(values);
      [randomValue] = values;
    } while (randomValue >= limit);

    return (randomValue % maximum) + 1;
  };

  /** @param {DiePrefix} prefix */
  const dieElements = (prefix) => ({
    select: prefix === 'first' ? elements.firstSelect : elements.secondSelect,
    customField: prefix === 'first' ? elements.firstCustomField : elements.secondCustomField,
    customInput: prefix === 'first' ? elements.firstCustom : elements.secondCustom,
    error: prefix === 'first' ? elements.firstError : elements.secondError,
    result: prefix === 'first' ? elements.firstResult : elements.secondResult,
    label: prefix === 'first' ? 'First die' : 'Second die',
  });

  /** @param {DiePrefix} prefix */
  const clearError = (prefix) => {
    const { customInput, error } = dieElements(prefix);
    customInput.setAttribute('aria-invalid', 'false');
    error.textContent = '';
    error.hidden = true;
  };

  /**
   * @param {DiePrefix} prefix
   * @param {string} message
   */
  const showError = (prefix, message) => {
    const { customInput, error } = dieElements(prefix);
    customInput.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
    customInput.focus();
  };

  /** @param {DiePrefix} prefix */
  const getSides = (prefix) => {
    const { select, customInput, label } = dieElements(prefix);
    clearError(prefix);

    if (select.value !== 'custom') return Number(select.value);

    const sides = Number(customInput.value);
    if (!Number.isInteger(sides) || sides < 1 || sides > 999) {
      showError(prefix, `${label} needs a whole number from 1 to 999.`);
      return null;
    }

    return sides;
  };

  const clearDisplayedRoll = () => {
    elements.firstResult.textContent = '?';
    elements.secondResult.textContent = '?';
    elements.firstResult.classList.remove('rolling', 'revealed');
    elements.secondResult.classList.remove('rolling', 'revealed');
    elements.rollSummary.hidden = state.round === 0;
    elements.roundOutput.textContent = `Ready for round ${state.round + 1}`;
    elements.sumOutput.textContent = '';
    elements.sumOutput.hidden = true;
  };

  /**
   * @param {DiePrefix} prefix
   * @param {boolean} [shouldFocus]
   */
  const syncCustomField = (prefix, shouldFocus = false) => {
    const { select, customField, customInput } = dieElements(prefix);
    const isCustom = select.value === 'custom';
    customField.hidden = !isCustom;
    customInput.disabled = state.rolling || !isCustom || (prefix === 'second' && !state.useSecondDie);
    clearError(prefix);
    clearDisplayedRoll();
    if (isCustom && shouldFocus) customInput.focus();
  };

  const syncControls = () => {
    elements.secondConfig.hidden = !state.useSecondDie;
    elements.secondConfig.disabled = !state.useSecondDie;
    elements.secondResult.hidden = !state.useSecondDie;
    elements.addButton.hidden = state.useSecondDie;
    elements.removeButton.hidden = !state.useSecondDie;

    elements.rollButton.disabled = state.rolling;
    elements.addButton.disabled = state.rolling;
    elements.removeButton.disabled = state.rolling;
    elements.resetButton.disabled = state.rolling;
    elements.firstSelect.disabled = state.rolling;
    elements.secondSelect.disabled = state.rolling || !state.useSecondDie;
    elements.firstCustom.disabled = state.rolling || elements.firstSelect.value !== 'custom';
    elements.secondCustom.disabled = state.rolling || !state.useSecondDie || elements.secondSelect.value !== 'custom';
  };

  /**
   * @param {HTMLOutputElement} output
   * @param {number} value
   */
  const setResult = (output, value) => {
    output.classList.remove('rolling', 'revealed');
    output.textContent = String(value);
    void output.offsetWidth;
    output.classList.add('revealed');
  };

  /** @param {RollResult} result */
  const revealRoll = ({ round, firstResult, secondResult }) => {
    setResult(elements.firstResult, firstResult);
    elements.roundOutput.textContent = `Round ${round}`;

    let message = `Round ${round}: first die rolled ${firstResult}.`;
    if (secondResult !== null) {
      setResult(elements.secondResult, secondResult);
      const sum = firstResult + secondResult;
      elements.sumOutput.textContent = `Total ${sum}`;
      elements.sumOutput.hidden = false;
      message = `Round ${round}: first die rolled ${firstResult}, second die rolled ${secondResult}, total ${sum}.`;
    } else {
      elements.sumOutput.textContent = '';
      elements.sumOutput.hidden = true;
    }

    state.rolling = false;
    state.revealTimeout = null;
    elements.form.setAttribute('aria-busy', 'false');
    syncControls();
    announce(message);
  };

  /** @param {SubmitEvent} event */
  const rollDice = (event) => {
    event.preventDefault();
    if (state.rolling) return;

    const firstSides = getSides('first');
    if (firstSides === null) {
      announce('Correct the first die and try again.');
      return;
    }

    const secondSides = state.useSecondDie ? getSides('second') : null;
    if (state.useSecondDie && secondSides === null) {
      announce('Correct the second die and try again.');
      return;
    }

    let firstResult;
    let secondResult = null;
    try {
      firstResult = randomInteger(firstSides);
      if (secondSides !== null) secondResult = randomInteger(secondSides);
    } catch {
      announce('Secure browser randomness is unavailable. Try a current browser.');
      return;
    }

    state.round += 1;
    state.rolling = true;
    elements.form.setAttribute('aria-busy', 'true');
    elements.rollSummary.hidden = false;
    elements.roundOutput.textContent = `Round ${state.round} rolling…`;
    syncControls();
    elements.firstResult.textContent = '…';
    elements.firstResult.classList.add('rolling');
    if (state.useSecondDie) {
      elements.secondResult.textContent = '…';
      elements.secondResult.classList.add('rolling');
    }
    state.revealTimeout = window.setTimeout(() => {
      revealRoll({ round: state.round, firstResult, secondResult });
    }, prefersReducedMotion() ? 0 : 350);
  };

  const addSecondDie = () => {
    state.useSecondDie = true;
    clearDisplayedRoll();
    syncControls();
    elements.secondSelect.focus();
    announce('Second die added.');
  };

  const removeSecondDie = () => {
    state.useSecondDie = false;
    elements.secondSelect.value = '20';
    elements.secondCustom.value = '';
    syncCustomField('second');
    syncControls();
    elements.firstSelect.focus();
    announce('Second die removed.');
  };

  const resetAll = () => {
    if (state.revealTimeout !== null) window.clearTimeout(state.revealTimeout);
    state.revealTimeout = null;
    state.rolling = false;
    elements.form.setAttribute('aria-busy', 'false');
    state.round = 0;
    state.useSecondDie = false;

    elements.firstSelect.value = '20';
    elements.secondSelect.value = '20';
    elements.firstCustom.value = '';
    elements.secondCustom.value = '';

    syncCustomField('first');
    syncCustomField('second');
    syncControls();
    announce('Dice roller reset.');
  };

  const requestReset = () => {
    if (state.round === 0) {
      resetAll();
      return;
    }

    if (typeof elements.resetDialog.showModal === 'function') {
      elements.resetDialog.returnValue = 'cancel';
      elements.resetDialog.showModal();
    } else {
      resetAll();
    }
  };

  elements.form.addEventListener('submit', rollDice);
  elements.addButton.addEventListener('click', addSecondDie);
  elements.removeButton.addEventListener('click', removeSecondDie);
  elements.resetButton.addEventListener('click', requestReset);

  elements.firstSelect.addEventListener('change', () => {
    syncCustomField('first', true);
    announce('First die updated.');
  });
  elements.secondSelect.addEventListener('change', () => {
    syncCustomField('second', true);
    announce('Second die updated.');
  });
  elements.firstCustom.addEventListener('input', () => {
    clearError('first');
    clearDisplayedRoll();
  });
  elements.secondCustom.addEventListener('input', () => {
    clearError('second');
    clearDisplayedRoll();
  });

  elements.resetDialog.addEventListener('close', () => {
    if (elements.resetDialog.returnValue === 'confirm') resetAll();
    window.setTimeout(() => elements.resetButton.focus(), 0);
  });

  window.addEventListener('beforeunload', () => {
    if (state.revealTimeout !== null) window.clearTimeout(state.revealTimeout);
    if (state.statusTimeout !== null) window.clearTimeout(state.statusTimeout);
  });

  syncCustomField('first');
  syncCustomField('second');
  syncControls();
})();
