let SHA256 = require('crypto-js/sha256');

window.sha256 = function (data) {
  return SHA256(data).toString();
};

let block_number = document.getElementById('block-number');
let nonce = document.getElementById('nonce');
let input = document.getElementById('data-input');
let hash = document.getElementById('hash-representation');
let mineButton = document.getElementById('mine-block');
let blockContainer = document.getElementById('hash-container-mined');
let zeroes = document.getElementById('zeroes');
let upButton = document.getElementById('up');
let downButton = document.getElementById('down');

let securityNumber = 4;
let minSecurityNumber = 0;
let maxSecurityNumber = 5;

block_number.innerHTML = '1';
let nonce_value = mineBlock();
nonce.innerHTML = nonce_value;
zeroes.innerHTML = 'Ceros precedentes: ' + securityNumber.toString();
hash.innerHTML = sha256(block_number.value + removeCommas(nonce_value));

if (securityNumber == maxSecurityNumber) {
  upButton.classList.add('button-disabled');
} else {
  upButton.classList.add('button-enabled');
}

block_number.onkeyup = function () {
  hash.innerHTML = SHA256(
    block_number.value + nonce.value + input.value
  ).toString();
  checkData();
};

nonce.onkeyup = function () {
  hash.innerHTML = SHA256(
    block_number.value + nonce.value + input.value
  ).toString();
  checkData();
};

input.onkeyup = function () {
  hash.innerHTML = SHA256(
    block_number.value + nonce.value + input.value
  ).toString();
  checkData();
};

mineButton.onclick = function () {
  nonce_value = mineBlock();
  data = block_number.value + removeCommas(nonce_value) + input.value;

  setTimeout(() => {
    hash.innerHTML = SHA256(data);
    // console.log(nonce_value);
    nonce.value = nonce_value;
    blockContainer.id = 'hash-container-mined';
  }, 250);
};

upButton.onclick = function () {
  if (securityNumber < maxSecurityNumber) {
    downButton.classList.remove('button-disabled');
    downButton.classList.add('button-enabled');
    securityNumber++;
    checkData();
    zeroes.innerHTML = 'Ceros precedentes: ' + securityNumber.toString();
    if (securityNumber == maxSecurityNumber) {
      upButton.classList.remove('button-enabled');
      upButton.classList.add('button-disabled');
    }
  }
};

downButton.onclick = function () {
  if (securityNumber > minSecurityNumber) {
    upButton.classList.remove('button-disabled');
    upButton.classList.add('button-enabled');
    securityNumber--;
    checkData();
    zeroes.innerHTML = 'Ceros precedentes: ' + securityNumber.toString();
    if (securityNumber == minSecurityNumber) {
      downButton.classList.remove('button-enabled');
      downButton.classList.add('button-disabled');
    }
  }
};

function mineBlock() {
  // mineButton.classList.remove('button-enabled');
  // mineButton.classList.add('fa fa-spinner fa-spin');
  let nonce_number = 0;

  while (true) {
    let mined_data = SHA256(
      block_number.value + nonce_number.toString() + input.value
    ).toString();

    if (mined_data.slice(0, securityNumber) === '0'.repeat(securityNumber)) {
      // console.log(nonce_number.toLocaleString());
      return nonce_number.toLocaleString();
    } else {
      nonce_number += 1;
    }
  }
}

function checkData() {
  let mined_data = SHA256(
    block_number.value + nonce.value + input.value
  ).toString();

  if (mined_data.slice(0, securityNumber) !== '0'.repeat(securityNumber)) {
    blockContainer.id = 'hash-container-not-mined';
  } else {
    blockContainer.id = 'hash-container-mined';
  }
}

function removeCommas(string) {
  let newString = '';

  for (let i = 0; i < string.length; i++) {
    if (string[i] != ',') {
      newString = newString.concat(string[i]);
    }
  }

  return newString;
}
