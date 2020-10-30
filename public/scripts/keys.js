let NodeRSA = require('node-rsa');

window.getKeys = function () {
  let key = new NodeRSA({ b: 128 });

  let publicKey = key.exportKey('public').toString().slice(27, 79);
  let privateKey_ = key.exportKey('private').toString().slice(32, 121);
  let privateKey = '';

  for (let i = 0; i < privateKey_.length; i++) {
    if (privateKey_[i] != '\n') {
      privateKey += privateKey_[i];
    }
  }

  return {
    publicKey: publicKey,
    privateKey: privateKey,
  };
};

let publicKey = document.getElementById('public-key');
let privateKey = document.getElementById('private-key');
let randomButton = document.getElementById('random-button');

let key;
let publicKeyValue;
let privateKey_;
let privateKeyValue;

updateKeys();

randomButton.onclick = updateKeys;

function getKeyPair() {
  key = new NodeRSA({ b: 128 });

  publicKeyValue = key.exportKey('public').toString().slice(27, 79);
  privateKey_ = key.exportKey('private').toString().slice(32, 121);
  privateKeyValue = '';

  for (let i = 0; i < privateKey_.length; i++) {
    if (privateKey_[i] != '\n') {
      privateKeyValue += privateKey_[i];
    }
  }
}

function updateKeys() {
  getKeyPair();
  publicKey.value = publicKeyValue;
  privateKey.value = privateKeyValue;
}
