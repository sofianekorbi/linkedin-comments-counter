// Widget UI management for LinkedIn Comments Counter
// Creates and manages the floating draggable widget

const Widget = {
  element: null,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },

  /**
   * Create and inject the widget into the page
   */
  create() {
    // Create widget container
    this.element = document.createElement('div');
    this.element.id = 'linkedin-comment-counter-widget';
    this.element.className = 'lcc-widget';

    // Widget HTML structure
    this.element.innerHTML = `
      <div class="lcc-widget-header">
        <div class="lcc-icon">💬</div>
      </div>
      <div class="lcc-widget-body">
        <div class="lcc-count-display">
          <span class="lcc-count-number">0</span>
        </div>
        <div class="lcc-label">comments</div>
      </div>
      <div class="lcc-animation-container"></div>
    `;

    // Append to body
    document.body.appendChild(this.element);

    // Initialize position
    this.initPosition();

    // Initialize dragging
    this.initDragging();

    // Update count display
    this.updateCount(Storage.getCount());
  },

  /**
   * Initialize widget position (from saved position or default)
   */
  initPosition() {
    const savedPosition = Storage.getWidgetPosition();

    if (savedPosition) {
      this.element.style.left = `${savedPosition.x}px`;
      this.element.style.top = `${savedPosition.y}px`;
      this.element.style.right = 'auto';
      this.element.style.bottom = 'auto';
    }
    // Default position is set in CSS (bottom-right)
  },

  /**
   * Initialize dragging functionality
   */
  initDragging() {
    const header = this.element.querySelector('.lcc-widget-header');

    header.addEventListener('mousedown', this.onDragStart.bind(this));
    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));

    // Touch support
    header.addEventListener('touchstart', this.onDragStart.bind(this));
    document.addEventListener('touchmove', this.onDragMove.bind(this));
    document.addEventListener('touchend', this.onDragEnd.bind(this));
  },

  /**
   * Handle drag start
   */
  onDragStart(e) {
    this.isDragging = true;
    this.element.classList.add('lcc-dragging');

    const rect = this.element.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    this.dragOffset = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };

    e.preventDefault();
  },

  /**
   * Handle drag move
   */
  onDragMove(e) {
    if (!this.isDragging) return;

    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

    const x = clientX - this.dragOffset.x;
    const y = clientY - this.dragOffset.y;

    // Constrain to viewport
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;

    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));

    this.element.style.left = `${constrainedX}px`;
    this.element.style.top = `${constrainedY}px`;
    this.element.style.right = 'auto';
    this.element.style.bottom = 'auto';

    e.preventDefault();
  },

  /**
   * Handle drag end
   */
  onDragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.element.classList.remove('lcc-dragging');

    // Save position
    const rect = this.element.getBoundingClientRect();
    Storage.saveWidgetPosition(rect.left, rect.top);
  },

  /**
   * Update the count display
   * @param {number} count - New count value
   */
  updateCount(count) {
    const countElement = this.element.querySelector('.lcc-count-number');
    if (countElement) {
      countElement.textContent = count;
    }
  },

  /**
   * Check if widget exists
   * @returns {boolean}
   */
  exists() {
    return this.element !== null && document.body.contains(this.element);
  }
};
