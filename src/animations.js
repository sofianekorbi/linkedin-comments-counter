// Animation management for LinkedIn Comments Counter
// Handles confetti, +1 popup, and pulse animations

const Animations = {
  /**
   * Trigger all animations when a comment is posted
   * @param {HTMLElement} widgetElement - The widget DOM element
   */
  triggerAll(widgetElement) {
    this.pulseCounter(widgetElement);
    this.showPlusOne(widgetElement);
    this.showConfetti(widgetElement);
  },

  /**
   * Pulse/scale animation on the counter
   * @param {HTMLElement} widgetElement
   */
  pulseCounter(widgetElement) {
    const counter = widgetElement.querySelector('.lcc-count-number');
    if (!counter) return;

    counter.classList.remove('lcc-pulse');
    // Force reflow to restart animation
    void counter.offsetWidth;
    counter.classList.add('lcc-pulse');

    // Remove class after animation ends
    setTimeout(() => {
      counter.classList.remove('lcc-pulse');
    }, 500);
  },

  /**
   * Show "+1" animation that rises and fades
   * @param {HTMLElement} widgetElement
   */
  showPlusOne(widgetElement) {
    const container = widgetElement.querySelector('.lcc-animation-container');
    if (!container) return;

    const plusOne = document.createElement('div');
    plusOne.className = 'lcc-plus-one';
    plusOne.textContent = '+1';

    container.appendChild(plusOne);

    // Remove after animation completes
    setTimeout(() => {
      plusOne.remove();
    }, 1500);
  },

  /**
   * Show confetti animation inside the widget
   * @param {HTMLElement} widgetElement
   */
  showConfetti(widgetElement) {
    const container = widgetElement.querySelector('.lcc-animation-container');
    if (!container) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#85c1e2', '#ff9ff3'];
    const confettiCount = 15;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'lcc-confetti';

      // Random position across the width
      const randomX = Math.random() * 100;
      confetti.style.left = `${randomX}%`;

      // Random color
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = randomColor;

      // Random delay for staggered effect
      const randomDelay = Math.random() * 0.3;
      confetti.style.animationDelay = `${randomDelay}s`;

      // Random rotation
      const randomRotation = Math.random() * 360;
      confetti.style.setProperty('--rotation', `${randomRotation}deg`);

      container.appendChild(confetti);

      // Remove after animation
      setTimeout(() => {
        confetti.remove();
      }, 2000);
    }
  },

  /**
   * Trigger celebration animation (for milestones if needed later)
   * @param {HTMLElement} widgetElement
   */
  celebrationBurst(widgetElement) {
    const container = widgetElement.querySelector('.lcc-animation-container');
    if (!container) return;

    container.classList.add('lcc-celebration');

    setTimeout(() => {
      container.classList.remove('lcc-celebration');
    }, 1000);
  }
};
