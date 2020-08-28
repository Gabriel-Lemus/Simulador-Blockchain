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

block_number.innerHTML = '1';
let nonce_value = mineBlock();
nonce.innerHTML = nonce_value.toString();

zeroes.innerHTML = 'Ceros precedentes: ' + securityNumber.toString();

document.getElementById('hash-representation').innerHTML = sha256(
  block_number.value + nonce_value
);

block_number.onkeyup = function () {
  hash.innerHTML = sha256(block_number.value + nonce.value + input.value);
  checkData();
};

nonce.onkeyup = function () {
  hash.innerHTML = sha256(block_number.value + nonce.value + input.value);
  checkData();
};

input.onkeyup = function () {
  hash.innerHTML = sha256(block_number.value + nonce.value + input.value);
  checkData();
};

mineButton.onclick = function () {
  nonce_value = mineBlock();
  data = block_number.value + nonce_value + input.value;

  setTimeout(() => {
    hash.innerHTML = sha256(data);
    // console.log(nonce_value);
    nonce.value = nonce_value.toString();
    blockContainer.id = 'hash-container-mined';
  }, 250);
};

upButton.onclick = function () {
  if (securityNumber < 4) {
    securityNumber++;
    checkData();
    zeroes.innerHTML = 'Ceros precedentes: ' + securityNumber.toString();
    if (securityNumber == 4) {
      upButton.class = 'button-disabled';
    }
  }
};

downButton.onclick = function () {
  if (securityNumber > 0) {
    securityNumber--;
    checkData();
    zeroes.innerHTML = 'Ceros precedentes: ' + securityNumber.toString();
    if (securityNumber == 0) {
      downButton.class = 'button-disabled';
    }
  }
};

function mineBlock() {
  let nonce_number = 0;

  while (true) {
    let mined_data = sha256(block_number.value + nonce_number + input.value);

    if (mined_data.slice(0, securityNumber) === '0'.repeat(securityNumber)) {
      return nonce_number;
    } else {
      nonce_number += 1;
    }
  }
}

function checkData() {
  let mined_data = sha256(block_number.value + nonce.value + input.value);

  if (mined_data.slice(0, securityNumber) !== '0'.repeat(securityNumber)) {
    blockContainer.id = 'hash-container-not-mined';
  } else {
    blockContainer.id = 'hash-container-mined';
  }
}
