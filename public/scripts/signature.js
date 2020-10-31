let NodeRSA = require('node-rsa');

let signatureCard = document.getElementById('signature-card');
let verificationCard = document.getElementById('verification-card');
let userMessage1 = document.getElementById('user-message-1');
let userMessage2 = document.getElementById('user-message-2');
let messageSignatureOriginal = document.getElementById(
  'message-signature-original'
);
let messageSignatureCopy = document.getElementById('message-signature-copy');
let privateKey = document.getElementById('private-key-space');
let publicKey = document.getElementById('public-key-space');
let signButton = document.getElementById('sign-button');
let verifyButton = document.getElementById('verify-button');

let key;
let publicKeyValue;
let privateKey_;
let privateKeyValue;
let previousSignature;
let newSignature;
let canVerify = false;
let previousSecondMessage = userMessage1.value.toString();
let newSecondMessage;
let validPublicKey = true;

setKeys();
verifyButton.classList.add('verify-button-disabled');

function getKeyPair() {
  key = new NodeRSA({ b: 512 });

  publicKeyValue = key.exportKey('public').toString().slice(27, 79);
  privateKey_ = key.exportKey('private').toString().slice(32, 121);
  privateKeyValue = '';

  for (let i = 0; i < privateKey_.length; i++) {
    if (privateKey_[i] != '\n') {
      privateKeyValue += privateKey_[i];
    }
  }
}

function setKeys() {
  getKeyPair();
  privateKey.value = privateKeyValue;
  publicKey.value = publicKeyValue;
}

signButton.onclick = function () {
  verifyButton.classList.remove('verify-button-disabled');
  canVerify = true;
  signButton.classList.add('sign-button-disabled');
  let data = userMessage1.value.toString();
  previousSignature = key.sign(data, 'base64', 'utf8');
  messageSignatureOriginal.value = previousSignature;
  messageSignatureCopy.value = previousSignature;
};

userMessage1.onkeyup = function () {
  userMessage2.value = userMessage1.value;
  previousSecondMessage = userMessage1.value.toString();
  newSignature = key.sign(userMessage1.value.toString(), 'base64', 'utf8');

  if (previousSignature != newSignature) {
    signButton.classList.remove('sign-button-disabled');
  } else {
    signButton.classList.add('sign-button-disabled');
  }
};

userMessage2.onkeyup = function () {
  newSecondMessage = userMessage2.value.toString();

  canVerify = true;

  if (previousSecondMessage == newSecondMessage) {
    verifyButton.classList.remove('verify-button');
    verifyButton.classList.add('verify-button-disabled');
    verifyButton.onclick();
  } else {
    verifyButton.classList.remove('verify-button-disabled');
    verifyButton.classList.add('verify-button');
  }
};

publicKey.onkeyup = function () {
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
  canVerify = true;
};

messageSignatureCopy.onkeyup = function () {
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
  canVerify = true;
};

verifyButton.onclick = function () {
  if (canVerify) {
    let data = userMessage2.value.toString();
    verifyButton.classList.remove('verify-button');
    verifyButton.classList.add('verify-button-disabled');

    let verification = key.verify(
      data,
      messageSignatureCopy.value.toString(),
      'utf8',
      'base64'
    );

    if (verification && validPublicKey) {
      verificationCard.classList.remove('container-no-match');
      verificationCard.classList.add('container-match');
    } else {
      verificationCard.classList.remove('container-match');
      verificationCard.classList.add('container-no-match');
    }

    canVerify = false;
  }
};
