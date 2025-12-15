export const calculateAccurateWidth = element => {
  if (!element) return 50;

  const clone = element.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.height = 'auto';
  clone.style.width = 'auto';
  clone.style.whiteSpace = 'nowrap';
  document.body.appendChild(clone);

  const contentWidth = clone.getBoundingClientRect().width;
  document.body.removeChild(clone);

  const styles = window.getComputedStyle(element);
  const padding =
    parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const border =
    parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth);

  const iconsWidth = element.querySelector('.anticon') ? 20 : 0;

  return contentWidth + padding + border + iconsWidth + 12;
};
