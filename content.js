import { adjustFontSize, resetFontSize } from './utils/fontSizeManager.js';
import { applyTheme } from './utils/themeManager.js';
import { setFontFamily, resetStyles } from './utils/styleManager.js';

// Initialize styles when the script loads
const init = () => {
  document.querySelectorAll('*').forEach(element => {
    saveOriginalStyle(element);
  });
};

// Run initialization after DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Message listener for popup commands
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.action) {
      case 'setFontSize':
        adjustFontSize(parseFloat(message.size));
        sendResponse({ success: true });
        break;
      case 'setFontFamily':
        setFontFamily(message.family);
        sendResponse({ success: true });
        break;
      case 'setTheme':
        applyTheme(message.theme);
        sendResponse({ success: true });
        break;
      case 'reset':
        document.querySelectorAll('*').forEach(element => {
          resetStyles(element);
        });
        resetFontSize();
        applyTheme('default');
        sendResponse({ success: true });
        break;
      default:
        console.warn('Unknown action:', message.action);
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true; // Keep the message channel open for async response
});
