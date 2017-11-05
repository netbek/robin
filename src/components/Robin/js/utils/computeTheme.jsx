export default function computeTheme({theme, padding, style, width, height}) {
  var overwrite = {};

  if (height) {
    overwrite.height = height;
  }

  if (padding) {
    overwrite.padding = padding;
  }

  if (style) {
    overwrite.style = style;
  }

  if (width) {
    overwrite.width = width;
  }

  return Object.assign({}, theme, overwrite);
}
