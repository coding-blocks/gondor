import ColorHash from 'color-hash';
import md5 from 'md5';

const colors = {};
const colorHash = new ColorHash({
  hue: [
    { min: 0, max: 10 },
    { min: 150, max: 360 },
  ],
  saturation: 0.7,
  lightness: [0.35, 0.4, 0.5],
});

export const uniqueHexColor = (id) =>
  colors[id] || (colors[id] = colorHash.hex(md5(id)));

if (typeof window !== 'undefined') window.uniqueColor = uniqueHexColor;
