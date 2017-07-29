const bttr = require('.');

const array = Uint8Array.from([
  0,
  0,
  0,
  0,
  0,
  0,
  100,
  200,
  150,
]);
const b = bttr(array);
const firstUnset = b.getFirstUnsetOffset();
b.setBits(1, 1, 1);
b.setBits(1, 0, 1);
const result = Array(8);
for (let i = 0; i < result.length; i++) {
  result[i] = b.getBits(8 * 6 + i, 1);
}
console.log(firstUnset, result);
