/**
 * Display copyright information in the footer
 * Automatically updates the copyright year to the current year
 * Uses optional chaining for safe DOM manipulation
 */
const showCopyRight = () => {
  const year = new Date().getFullYear();
  const copyRightElement = document.getElementById('copyRight');

  // Optional chaining for safer DOM manipulation
  copyRightElement?.textContent && (copyRightElement.textContent = `© 2020 – ${year} yumeangelica.github.io. All Rights Reserved.`);
};