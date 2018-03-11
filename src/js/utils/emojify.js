import emojione from 'emojione';

function emojify(str, size = 32) {
  emojione.imagePathPNG = `/node_modules/emojione-assets/png/${size}/`;

  return emojione.toImage(str);
}

export default emojify;
