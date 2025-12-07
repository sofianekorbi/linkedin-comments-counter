// Main content script for LinkedIn Comments Counter
// Detects comment button clicks and manages the extension

(function() {
  'use strict';

  const COMMENT_BUTTON_SELECTOR = 'button.comments-comment-box__submit-button--cr';
  let isInitialized = false;
  let observer = null;

  /**
   * Initialize the extension
   */
  function init() {
    if (isInitialized) return;

    console.log('[LinkedIn Comments Counter] Initializing...');

    // Create widget
    Widget.create();

    // Set up comment button detection
    setupCommentButtonDetection();

    // Set up periodic reset check (every 60 seconds)
    setInterval(checkForDailyReset, 60000);

    isInitialized = true;
    console.log('[LinkedIn Comments Counter] Initialized successfully');
  }

  /**
   * Set up detection for comment button clicks
   */
  function setupCommentButtonDetection() {
    // Initial detection of existing buttons
    attachListenersToExistingButtons();

    // Set up MutationObserver for dynamically loaded buttons
    observeDOM();

    // Try multiple event types and phases to catch the click
    // Use capture phase (true) to catch events before LinkedIn
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('mouseup', handleClick, true);

    // Also try bubble phase as backup
    document.addEventListener('click', handleClick, false);

    console.log('[LinkedIn Comments Counter] Event listeners attached');
  }

  /**
   * Attach listeners to existing comment buttons
   */
  function attachListenersToExistingButtons() {
    const buttons = document.querySelectorAll(COMMENT_BUTTON_SELECTOR);
    console.log(`[LinkedIn Comments Counter] Found ${buttons.length} comment buttons`);

    // Also try direct listeners on each button
    buttons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        console.log(`[LinkedIn Comments Counter] Direct listener triggered on button ${index}`);
        handleCommentButtonClick();
      }, true);
    });
  }

  /**
   * Handle click events (event delegation approach)
   */
  function handleClick(event) {
    const target = event.target;

    // Check if the clicked element is a comment button or inside one
    const commentButton = target.closest(COMMENT_BUTTON_SELECTOR);

    if (commentButton) {
      console.log(`[LinkedIn Comments Counter] Click detected on comment button via ${event.type}`);
      handleCommentButtonClick();
    }
  }

  /**
   * Handle comment button click
   */
  function handleCommentButtonClick() {
    console.log('[LinkedIn Comments Counter] Comment button clicked!');

    // Increment counter
    const newCount = Storage.incrementCount();

    // Update widget display
    Widget.updateCount(newCount);

    // Trigger animations
    Animations.triggerAll(Widget.element);
  }

  /**
   * Set up MutationObserver to detect new comment buttons
   */
  function observeDOM() {
    if (observer) return;

    observer = new MutationObserver(debounce((mutations) => {
      // Check if new comment buttons were added
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          attachListenersToExistingButtons();
          break;
        }
      }
    }, 500));

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Check for daily reset
   */
  function checkForDailyReset() {
    const wasReset = Storage.checkAndResetIfNewDay();

    if (wasReset) {
      console.log('[LinkedIn Comments Counter] New day detected - counter reset');
      Widget.updateCount(0);
    }
  }

  /**
   * Debounce function to limit rapid calls
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Clean up on unload
   */
  window.addEventListener('beforeunload', () => {
    if (observer) {
      observer.disconnect();
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
