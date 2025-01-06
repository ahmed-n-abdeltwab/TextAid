// Store original styles
const styleCache = new WeakMap();

export function saveOriginalStyle(element) {
  if (!styleCache.has(element)) {
    const computedStyle = window.getComputedStyle(element);
    styleCache.set(element, {
      fontFamily: computedStyle.fontFamily
    });
  }
  return styleCache.get(element);
}

export function setFontFamily(family) {
  document.querySelectorAll('*').forEach(element => {
    saveOriginalStyle(element);
    element.style.fontFamily = family;
  });
}

export function resetStyles(element) {
  if (styleCache.has(element)) {
    const original = styleCache.get(element);
    element.style.fontFamily = original.fontFamily;
  } else {
    element.style.removeProperty('font-family');
  }
}
