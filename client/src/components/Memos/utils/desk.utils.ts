export const getRem = (): number => {
  const htmlElement = document.documentElement;
  const computedStyle = window.getComputedStyle(htmlElement);
  const baseFontSize = computedStyle.fontSize;

  const baseFontSizeNumber = parseFloat(baseFontSize);

  return baseFontSizeNumber;
};
