//! public/js/main/selectors.js

/**
 * Global DOM selectors shared across Home page.
 * Loaded early to provide common layout references.
 */

// Main layout container
const main = document.querySelector('main');

// Background overlay used for visual effects
const overlay = main?.querySelector('.background-overlay');

// About section tabs
const tabLinks = document.querySelectorAll('.tab-links');
const tabContents = document.querySelectorAll('.tab-contents');

// Portfolio section
const workContainer = document.querySelector('.work-list');
const projects = document.querySelectorAll('.work');
const seeMoreBtn = document.querySelector('#see-more-btn');
