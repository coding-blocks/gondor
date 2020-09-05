import rgbHex from 'rgb-hex';

const PHI = (1 + Math.sqrt(5)) / 2;

export const uniqueHexColor = (id) => {
  const n = id * PHI - Math.floor(id * PHI);

  return (
    '#' + rgbHex(Math.floor(n * 256), Math.floor(n * 256), Math.floor(n * 256))
  );
};
