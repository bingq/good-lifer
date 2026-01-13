/** @type {const} */
const themeColors = {
  primary: { light: '#4CAF50', dark: '#66BB6A' },
  // Warmer, softer backgrounds for bedtime use
  background: { light: '#F9F9F9', dark: '#1E1E1E' }, // Slightly warmer dark background
  surface: { light: '#FFFFFF', dark: '#2A2A2A' }, // Softer dark surface
  foreground: { light: '#2C3E50', dark: '#F5F5F5' }, // Softer white for dark mode
  muted: { light: '#7F8C8D', dark: '#B8B8B8' }, // Better contrast in dark mode
  border: { light: '#E0E0E0', dark: '#3A3A3A' }, // Softer borders
  success: { light: '#81C784', dark: '#A5D6A7' },
  warning: { light: '#FF9800', dark: '#FFB74D' },
  error: { light: '#EF5350', dark: '#E57373' },
  accent: { light: '#9C27B0', dark: '#BA68C8' },
};

module.exports = { themeColors };
