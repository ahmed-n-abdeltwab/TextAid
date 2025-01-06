// Theme configurations
const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    link: '#0066cc',
    border: '#dddddd',
    input: '#ffffff',
    inputText: '#000000'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    link: '#66b3ff',
    border: '#404040',
    input: '#2d2d2d',
    inputText: '#ffffff'
  }
};

// Store original colors
const colorCache = new WeakMap();

// Elements that should keep their original colors
const preserveColorElements = [
  'img',
  'video',
  'canvas',
  'svg',
  '[data-preserve-color]'
];

// Save original colors for an element
function saveOriginalColors(element) {
  if (!colorCache.has(element)) {
    const computedStyle = window.getComputedStyle(element);
    colorCache.set(element, {
      backgroundColor: computedStyle.backgroundColor,
      color: computedStyle.color,
      borderColor: computedStyle.borderColor
    });
  }
  return colorCache.get(element);
}

// Check if element should preserve its colors
function shouldPreserveColors(element) {
  return preserveColorElements.some(selector => 
    element.matches(selector) || element.closest(selector)
  );
}

// Apply theme colors to an element
function applyThemeColors(element, theme) {
  if (shouldPreserveColors(element)) {
    return;
  }

  const themeColors = themes[theme];
  const computedStyle = window.getComputedStyle(element);
  
  // Apply background color if element has a visible background
  if (computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    element.style.backgroundColor = themeColors.background;
  }
  
  // Apply text color
  element.style.color = themeColors.text;
  
  // Handle links specially
  if (element.tagName.toLowerCase() === 'a') {
    element.style.color = themeColors.link;
  }
  
  // Handle form elements
  if (element.tagName.toLowerCase() === 'input' || 
      element.tagName.toLowerCase() === 'textarea' || 
      element.tagName.toLowerCase() === 'select') {
    element.style.backgroundColor = themeColors.input;
    element.style.color = themeColors.inputText;
    element.style.borderColor = themeColors.border;
  }
}

export function applyTheme(themeName) {
  const elements = document.querySelectorAll('*');
  
  // Save original colors if not already saved
  elements.forEach(element => {
    if (!colorCache.has(element)) {
      saveOriginalColors(element);
    }
  });
  
  if (themeName === 'default') {
    // Restore original colors
    elements.forEach(element => {
      if (colorCache.has(element)) {
        const original = colorCache.get(element);
        element.style.backgroundColor = original.backgroundColor;
        element.style.color = original.color;
        element.style.borderColor = original.borderColor;
      } else {
        element.style.removeProperty('background-color');
        element.style.removeProperty('color');
        element.style.removeProperty('border-color');
      }
    });
  } else {
    // Apply theme colors
    elements.forEach(element => {
      applyThemeColors(element, themeName);
    });
  }
}
