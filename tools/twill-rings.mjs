#!/usr/bin/env node
// Prints the text-shadow rings of the Varsity style's twill lettering (the .vs-twill rules in
// plugin/skills/swipe-styles/styles/varsity/style.css). Each ring is copies of the text placed on a
// circle, in em, so the rings scale with the text and have round joins. The colors are CSS variables
// (--vs-r1, --vs-r2, --vs-r3), so only a change of radius or number of copies needs this tool.
//
//   node tools/twill-rings.mjs regular|xl|huge
//
// Paste the output over the matching text-shadow declaration.

const SIZES = {
  // [radius, copies] of the inner ring, the outer ring, and the drop copy of the outer ring (offset x, y)
  regular: { inner: [0.05, 24], outer: [0.095, 24], drop: [0.095, 12, 0.035, 0.045] },
  xl: { inner: [0.042, 36], outer: [0.078, 36], drop: [0.078, 18, 0.03, 0.04] },
  huge: { inner: [0.034, 64], outer: [0.062, 64], drop: [0.062, 24, 0.025, 0.032] },
};

function em(value) {
  const text = value.toFixed(3);
  return Number(text) === 0 ? '0' : `${text}em`;
}

function ring(radius, variable, copies, dx = 0, dy = 0) {
  return Array.from({ length: copies }, (_, i) => {
    const angle = (2 * Math.PI * i) / copies;
    return `${em(dx + radius * Math.cos(angle))} ${em(dy + radius * Math.sin(angle))} 0 var(${variable})`;
  });
}

const size = SIZES[process.argv[2]];
if (!size) {
  console.error(`Usage: node tools/twill-rings.mjs ${Object.keys(SIZES).join('|')}`);
  process.exit(1);
}

const items = [
  ...ring(size.inner[0], '--vs-r1', size.inner[1]),
  ...ring(size.outer[0], '--vs-r2', size.outer[1]),
  ...ring(size.drop[0], '--vs-r3', size.drop[1], size.drop[2], size.drop[3]),
];
const rows = [];
for (let i = 0; i < items.length; i += 4) rows.push(items.slice(i, i + 4).join(', '));
console.log(`text-shadow:\n    ${rows.join(',\n    ')};`);
