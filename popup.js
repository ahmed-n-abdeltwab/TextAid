document.addEventListener('DOMContentLoaded', () => {
  const fontSizeSlider = document.getElementById('fontSize');
  const fontSizeValue = document.getElementById('fontSizeValue');
  const fontFamilySelect = document.getElementById('fontFamily');
  const themeSelect = document.getElementById('theme');
  const resetButton = document.getElementById('reset');

  // Load saved settings
  browser.storage.local.get(['fontSize', 'fontFamily', 'theme'])
    .then(({ fontSize = 100, fontFamily = 'Arial', theme = 'default' }) => {
      fontSizeSlider.value = fontSize;
      fontSizeValue.textContent = fontSize;
      fontFamilySelect.value = fontFamily;
      themeSelect.value = theme;

      // Apply saved settings immediately
      updateFontSize(fontSize);
      updateFontFamily(fontFamily);
      updateTheme(theme);
    })
    .catch(error => console.error('Error loading settings:', error));

  // Update functions
  const updateFontSize = (size) => {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        return browser.tabs.sendMessage(tabs[0].id, {
          action: 'setFontSize',
          size: size
        });
      })
      .then(response => {
        if (response && response.success) {
          browser.storage.local.set({ fontSize: size });
        }
      })
      .catch(error => console.error('Error updating font size:', error));
  };

  const updateFontFamily = (family) => {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        return browser.tabs.sendMessage(tabs[0].id, {
          action: 'setFontFamily',
          family: family
        });
      })
      .then(response => {
        if (response && response.success) {
          browser.storage.local.set({ fontFamily: family });
        }
      })
      .catch(error => console.error('Error updating font family:', error));
  };

  const updateTheme = (theme) => {
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        return browser.tabs.sendMessage(tabs[0].id, {
          action: 'setTheme',
          theme: theme
        });
      })
      .then(response => {
        if (response && response.success) {
          browser.storage.local.set({ theme: theme });
        }
      })
      .catch(error => console.error('Error updating theme:', error));
  };

  // Event listeners with debouncing for font size
  let fontSizeTimeout;
  fontSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    fontSizeValue.textContent = size;
    
    clearTimeout(fontSizeTimeout);
    fontSizeTimeout = setTimeout(() => {
      updateFontSize(size);
    }, 100);
  });

  fontFamilySelect.addEventListener('change', (e) => {
    updateFontFamily(e.target.value);
  });

  themeSelect.addEventListener('change', (e) => {
    updateTheme(e.target.value);
  });

  resetButton.addEventListener('click', () => {
    const defaultSettings = {
      fontSize: 100,
      fontFamily: 'Arial',
      theme: 'default'
    };

    // Update UI
    fontSizeSlider.value = defaultSettings.fontSize;
    fontSizeValue.textContent = defaultSettings.fontSize;
    fontFamilySelect.value = defaultSettings.fontFamily;
    themeSelect.value = defaultSettings.theme;

    // Reset page styles
    browser.tabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        return browser.tabs.sendMessage(tabs[0].id, { action: 'reset' });
      })
      .then(response => {
        if (response && response.success) {
          browser.storage.local.clear();
        }
      })
      .catch(error => console.error('Error resetting styles:', error));
  });
});
