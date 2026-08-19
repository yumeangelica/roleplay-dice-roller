# Roleplay Dice Roller

A static Vanilla JavaScript dice roller for tabletop roleplaying games. Roll one or two standard dice, or define a custom die with up to 999 sides.

Originally created in 2020 and polished in 2026 with yumeangelica's warm mauve design system, self-hosted Comfortaa, mobile-first controls, and clearer result and validation states.

## Features

- D4, D6, D8, D10, D12, D20, D100, and custom 1–999-sided dice
- One- or two-die rolls with round and total tracking
- `crypto.getRandomValues()` with rejection sampling to avoid modulo bias
- Short dice animation whose timing is separate from result logic
- Inline custom-value errors linked to their fields
- Native reset dialog with focus restoration
- System-aware light/dark theme switch with a saved user preference
- Reduced-motion, forced-colors, browser zoom, and 44px+ target support

## Technology

- Semantic HTML, modern CSS, and Vanilla JavaScript
- Web Crypto API for unbiased bounded random integers
- Self-hosted Comfortaa 400/600/700 under the SIL Open Font License
- No runtime dependencies, package manager, or build step

## Run locally

Open `index.html`, or run `python3 -m http.server 4173` and visit `http://localhost:4173`.

Choose a die, optionally add the second die, and select **Roll dice**. Choosing **Custom** reveals the 1–999 side input.

## Accessibility notes

The roller uses native fieldsets and controls, one polite roll-status region, explicit inline errors, visible focus, and motion-independent results. It targets WCAG 2.2 AA practices, but this is not a claim of complete conformance without assistive-technology and device testing.

## Project structure

```text
index.html       Dice controls, outputs, and reset dialog
styles.css       Palette A tokens and mobile-first styles
app.js           Validation, randomness, animation state, and results
theme.js         Early theme setup, switch state, and saved preference
copyright.js     Current footer year
fonts/           Local Comfortaa files and OFL license
```

## License

Application code and content are licensed under [CC BY-NC-SA 4.0](LICENSE). Comfortaa remains under the SIL Open Font License in `fonts/OFL.txt`.

---

Created with love by [yumeangelica](https://yumeangelica.github.io) · 2020–2026
