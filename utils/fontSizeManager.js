// Store original font sizes
const fontSizeCache = new WeakMap();

// Elements that shouldn't be scaled
const SKIP_TAGS = ['svg', 'img', 'video', 'canvas'];

// Save original font size for an element
function saveOriginalFontSize(element) {
  if (!fontSizeCache.has(element)) {
    const computedStyle = window.getComputedStyle(element);
    fontSizeCache.set(element, parseFloat(computedStyle.fontSize));
  }
  return fontSizeCache.get(element);
}

// Get all text elements while excluding certain elements
function getTextElements() {
  return Array.from(document.querySelectorAll('*'))
    .filter(element => !SKIP_TAGS.includes(element.tagName.toLowerCase()));
}

// Apply font size scaling with better control
export function adjustFontSize(scale) {
  const elements = getTextElements();
  elements.forEach(element => {
    const originalSize = saveOriginalFontSize(element);
    const newSize = originalSize * (scale / 100);
    element.style.fontSize = `${newSize}px`;
  });
}

export function resetFontSize() {
  const elements = getTextElements();
  elements.forEach(element => {
    if (fontSizeCache.has(element)) {
      element.style.fontSize = `${fontSizeCache.get(element)}px`;
    } else {
      element.style.removeProperty('font-size');
    }
  });
}
