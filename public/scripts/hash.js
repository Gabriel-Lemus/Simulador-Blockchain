let SHA256 = require('crypto-js/sha256');

let input = document.getElementById('data-input');
let hash = document.getElementById('hash-representation');

hash.innerHTML = SHA256(input.value);

input.onkeyup = function () {
  hash.innerHTML = SHA256(input.value);
  // console.log(SHA256(input.value));
};
