// Storage management for LinkedIn Comments Counter
// Handles counter state and daily reset logic

const STORAGE_KEYS = {
  COUNT: 'linkedin-comment-count',
  LAST_RESET_DATE: 'linkedin-last-reset-date',
  WIDGET_POSITION: 'linkedin-widget-position'
};

const Storage = {
  /**
   * Initialize storage with default values if not set
   */
  init() {
    if (localStorage.getItem(STORAGE_KEYS.COUNT) === null) {
      localStorage.setItem(STORAGE_KEYS.COUNT, '0');
    }

    if (localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE) === null) {
      const today = this.getTodayDate();
      localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today);
    }

    // Check if we need to reset on init
    this.checkAndResetIfNewDay();
  },

  /**
   * Get current count
   * @returns {number} Current comment count
   */
  getCount() {
    const count = localStorage.getItem(STORAGE_KEYS.COUNT);
    return parseInt(count) || 0;
  },

  /**
   * Increment the counter by 1
   * @returns {number} New count value
   */
  incrementCount() {
    const currentCount = this.getCount();
    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEYS.COUNT, newCount.toString());
    return newCount;
  },

  /**
   * Reset counter to 0
   */
  resetCount() {
    localStorage.setItem(STORAGE_KEYS.COUNT, '0');
  },

  /**
   * Get last reset date
   * @returns {string} Date in YYYY-MM-DD format
   */
  getLastResetDate() {
    return localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE) || this.getTodayDate();
  },

  /**
   * Set last reset date to today
   */
  setLastResetDate() {
    const today = this.getTodayDate();
    localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today);
  },

  /**
   * Get today's date in YYYY-MM-DD format
   * @returns {string} Today's date
   */
  getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Check if it's a new day and reset counter if needed
   * @returns {boolean} True if reset occurred
   */
  checkAndResetIfNewDay() {
    const today = this.getTodayDate();
    const lastResetDate = this.getLastResetDate();

    if (today !== lastResetDate) {
      this.resetCount();
      this.setLastResetDate();
      return true;
    }

    return false;
  },

  /**
   * Save widget position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  saveWidgetPosition(x, y) {
    const position = { x, y };
    localStorage.setItem(STORAGE_KEYS.WIDGET_POSITION, JSON.stringify(position));
  },

  /**
   * Get saved widget position
   * @returns {Object|null} Position object {x, y} or null
   */
  getWidgetPosition() {
    const positionStr = localStorage.getItem(STORAGE_KEYS.WIDGET_POSITION);
    if (positionStr) {
      try {
        return JSON.parse(positionStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

// Auto-initialize storage
Storage.init();
