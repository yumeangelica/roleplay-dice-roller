# Roleplay Dice Roller

Originally developed in 2020, this modern Vanilla JavaScript dice roller is specifically designed for tabletop roleplaying games. The application provides an intuitive interface for rolling custom dice and tracking game statistics.

**Major modernization update in 2026** - Completely redesigned with a pink aesthetic, 3D dice animations, enhanced accessibility, and mobile-first responsive design. Zero external JavaScript dependencies.

## Features

- **Flexible Dice System** - Choose between one or two dice with configurable dice types (D4, D6, D8, D10, D12, D20, D100, or Custom)
- **Dice Type Selection** - Dropdown menus for each die with common RPG dice types and custom option (1–999 sides)
- **3D Dice Animations** - Perspective-based tumble animation with result pop-in effect
- **Roll Tracking** - Automatic counter for number of rounds and dice sum totals
- **Smart Reset** - Reset with confirmation dialog to prevent accidental loss of progress
- **Cryptographic Randomness** - Uses `crypto.getRandomValues()` for fair dice rolls
- **Modern UI/UX** - Pink color palette with smooth animations and subtle borders
- **Mobile-First Design** - Optimized layout that works on all devices with zoom prevention
- **Touch-Action Optimized** - Prevents unwanted zooming and ensures precise touch interactions
- **Accessibility Ready** - ARIA labels, keyboard navigation, and screen reader support
- **Portfolio Integration** - Direct links to source code and developer portfolio

## Technologies & Standards

- **Vanilla JavaScript (ES6+)** - Modern syntax with const/let, arrow functions, and Web Crypto API
- **HTML5** - Semantic markup with accessibility best practices and mobile viewport optimization
- **CSS3** - Custom properties, Flexbox, 3D transforms, perspective animations, and responsive design
- **Google Fonts (Inter)** - Professional typography optimized for web
- **Zero Dependencies** - No frameworks or external JavaScript libraries required
- **Mobile-First Approach** - Touch-optimized with zoom prevention and tap highlight removal

## Accessibility & UX Features

- **Keyboard Navigation** - Full app functionality via keyboard, Enter key triggers roll
- **Screen Reader Support** - Comprehensive ARIA labels and descriptions
- **Input Validation** - Inline error messages with auto-clear and shake animation
- **Mobile Optimized** - Touch-friendly interface with proper spacing and zoom prevention
- **Touch-Action Control** - Prevents unwanted zooming and accidental selections on mobile devices
- **Cross-Platform Touch** - Optimized for both mouse and touch interactions

## Getting Started

1. **Clone or Download** - Get the project files to your local machine
2. **Open in Browser** - Simply open `index.html` in any modern web browser
3. **Select Dice Type** - Choose your preferred dice type from the dropdown
4. **Enter Dice Values** - For custom dice, enter the number of sides (1–999)
5. **Start Rolling** - Click "Roll Dice" or press Enter to roll
6. **Add Second Dice** - Click "Add dice" to add a second die for combined rolls
7. **Track Progress** - View round counters and sum totals automatically

## Browser Support

This application works on all modern browsers including:

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+
- **Mobile browsers** - iOS Safari, Chrome Mobile, Samsung Internet

## Responsive Breakpoints

- **Desktop** - Full layout for screens 769px+
- **Tablet** - Adjusted spacing and sizing for 481px–768px
- **Mobile** - Touch-optimized interface for 321px–480px
- **Small screens** - Ultra-compact mode for 320px and below

## Design System

- **Color Palette** - Pink-themed with design tokens as CSS custom properties
- **Typography** - Inter font family for clean, modern readability
- **Spacing** - Responsive scaling with `clamp()` functions
- **Animations** - 0.25s transitions, 0.65s 3D dice tumble with spring easing

## Project Structure

```
├── index.html      # Main HTML document
├── styles.css      # All styles with CSS custom properties
├── app.js          # Dice rolling logic, animations, and UI state
├── copyright.js    # Dynamic footer copyright year
├── LICENSE         # CC BY-NC-SA 4.0
└── README.md
```

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. See the [LICENSE](LICENSE) file for details.

---

**Created with love by [yumeangelica](https://yumeangelica.github.io) | 2020–2026**