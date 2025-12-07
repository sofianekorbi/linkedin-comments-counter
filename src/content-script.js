// Main content script for LinkedIn Comments Counter
// Detects comment button clicks and manages the extension

(function() {
  'use strict';

  const COMMENT_BUTTON_SELECTOR = 'button.comments-comment-box__submit-button--cr';
  let isInitialized = false;
  let observer = null;
  let lastClickTime = 0;
  let clickDebounceDelay = 500; // 500ms protection contre les clics multiples

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
    // Set up MutationObserver for dynamically loaded buttons
    observeDOM();

    // Use ONLY click event delegation with capture phase
    // This avoids duplicate triggers
    document.addEventListener('click', handleClick, true);

    console.log('[LinkedIn Comments Counter] Event listeners attached');
  }

  /**
   * Attach listeners to existing comment buttons
   */
  function attachListenersToExistingButtons() {
    const buttons = document.querySelectorAll(COMMENT_BUTTON_SELECTOR);
    console.log(`[LinkedIn Comments Counter] Found ${buttons.length} comment buttons`);
  }

  /**
   * Handle click events (event delegation approach)
   */
  function handleClick(event) {
    // Only handle click events, ignore mousedown/mouseup
    if (event.type !== 'click') return;

    const target = event.target;

    // Check if the clicked element is a comment button or inside one
    const commentButton = target.closest(COMMENT_BUTTON_SELECTOR);

    if (commentButton) {
      console.log(`[LinkedIn Comments Counter] Click detected on comment button`);
      handleCommentButtonClick(commentButton);
    }
  }

  /**
   * Check if the post is authored by the current user
   */
  function isMyOwnPost(commentButton) {
    // Find the post container
    const postContainer = commentButton.closest('.feed-shared-update-v2') ||
                          commentButton.closest('[data-urn]') ||
                          commentButton.closest('article') ||
                          commentButton.closest('.ember-view');

    if (!postContainer) {
      console.log('[LinkedIn Comments Counter] Post container not found');
      return false;
    }

    // Strategy 1: Check for "• Vous" or "• You" text (reliable indicator)
    const postText = postContainer.textContent || '';
    if (postText.includes('• Vous') || postText.includes('• You')) {
      console.log('[LinkedIn Comments Counter] Detected own post (found "• Vous/You") - skipping count');
      return true;
    }

    // Strategy 2: Check for edit/delete options (only visible on own posts)
    const editButton = postContainer.querySelector('[aria-label*="Modifier"]') ||
                       postContainer.querySelector('[aria-label*="Edit"]');
    const deleteOption = postContainer.querySelector('[aria-label*="Supprimer"]') ||
                         postContainer.querySelector('[aria-label*="Delete"]');

    if (editButton || deleteOption) {
      console.log('[LinkedIn Comments Counter] Detected own post (found edit/delete options) - skipping count');
      return true;
    }

    // Strategy 3: Check for data-control-name="edit" attribute
    const hasEditControl = postContainer.querySelector('[data-control-name="edit"]');
    if (hasEditControl) {
      console.log('[LinkedIn Comments Counter] Detected own post (found edit control) - skipping count');
      return true;
    }

    return false;
  }

  /**
   * Handle comment button click
   */
  function handleCommentButtonClick(commentButton) {
    // Protection contre les clics multiples
    const now = Date.now();
    if (now - lastClickTime < clickDebounceDelay) {
      console.log('[LinkedIn Comments Counter] Click ignored (debounced)');
      return;
    }
    lastClickTime = now;

    // Check if this is the user's own post
    if (isMyOwnPost(commentButton)) {
      console.log('[LinkedIn Comments Counter] Own post - not counting');
      return;
    }

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
