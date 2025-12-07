# LinkedIn Comments Counter

A Chrome extension to gamify your LinkedIn commenting activity with a fun floating counter and animations.

## Features

- **Live Comment Counter**: Tracks your daily comments on LinkedIn
- **Gamified Animations**:
  - Confetti burst inside the widget
  - "+1" popup animation
  - Counter pulse effect
- **Draggable Widget**: Move it anywhere on the page
- **Daily Auto-Reset**: Counter resets at midnight automatically
- **Local Storage**: All data stays on your machine

## Installation

### Load as Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `linkedin-comments-counter` folder
5. The extension should now appear in your extensions list

### Icons Setup

Before loading the extension, you need to add icon files:

1. Create three PNG icon files with these dimensions:
   - `icons/icon16.png` - 16x16 pixels
   - `icons/icon48.png` - 48x48 pixels
   - `icons/icon128.png` - 128x128 pixels

2. You can use any image editor or online tool to create these icons
3. Suggested design: A speech bubble or comment icon with vibrant colors

## Usage

1. Navigate to [linkedin.com](https://linkedin.com)
2. The widget will appear in the bottom-right corner
3. Click on any "Commenter" button on a LinkedIn post
4. Watch the counter increment with fun animations!
5. Drag the widget anywhere by clicking and dragging the icon area
6. Your count and widget position are saved automatically
7. Counter resets at midnight each day

## How It Works

The extension uses:
- **Content Script**: Injected into LinkedIn pages to detect comment button clicks
- **Local Storage**: Stores count, last reset date, and widget position
- **CSS Animations**: Smooth, performant animations
- **Manifest V3**: Latest Chrome extension standard

## File Structure

```
linkedin-comments-counter/
├── manifest.json              # Extension configuration
├── src/
│   ├── content-script.js     # Main logic
│   ├── storage.js            # Data persistence
│   ├── widget.js             # UI management
│   ├── animations.js         # Animation effects
│   └── styles/
│       └── widget.css        # Widget styling
├── icons/
│   ├── icon16.png           # Extension icon (16x16)
│   ├── icon48.png           # Extension icon (48x48)
│   └── icon128.png          # Extension icon (128x128)
└── README.md                 # This file
```

## Development

### Testing

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload LinkedIn to test changes

### Debugging

- Open DevTools on LinkedIn (F12)
- Check Console for logs prefixed with `[LinkedIn Comments Counter]`
- Inspect the widget element (ID: `linkedin-comment-counter-widget`)

### Storage Keys

The extension uses these localStorage keys:
- `linkedin-comment-count`: Current count (number)
- `linkedin-last-reset-date`: Last reset date (YYYY-MM-DD)
- `linkedin-widget-position`: Widget position ({x, y})

## Browser Compatibility

- Chrome (tested)
- Edge (Chromium-based, should work)
- Other Chromium browsers (should work)

## Privacy

This extension:
- Does NOT collect any personal data
- Does NOT send data to external servers
- Stores all data locally in your browser
- Only runs on linkedin.com domains

## License

MIT License - Feel free to modify and use as needed!

## Credits

Built with vanilla JavaScript, no external dependencies (except browser APIs).

---

**Note**: This is a personal productivity tool. LinkedIn is a trademark of LinkedIn Corporation.
