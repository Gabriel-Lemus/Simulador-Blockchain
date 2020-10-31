let NodeRSA = require('node-rsa');

let verificationCard = document.getElementById('verification-card');
let amount1 = document.getElementById('amount-1');
let amount2 = document.getElementById('amount-2');
let sender1 = document.getElementById('sender-1');
let sender2 = document.getElementById('sender-2');
let receiver1 = document.getElementById('receiver-1');
let receiver2 = document.getElementById('receiver-2');
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
let validPublicKey = true;
let data;

setKeys();
setMessage();
changeData();

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

function setMessage() {
  amount1.value = '50.00';
  amount2.value = '50.00';
  sender1.value = 'Juan';
  sender2.value = 'Juan';
  receiver1.value = 'Francisco';
  receiver2.value = 'Francisco';
}

function changeData() {
  data =
    'Q.' +
    amount1.value.toString() +
    ' from ' +
    sender1.value.toString() +
    ' to ' +
    receiver1.value.toString();
}

signButton.onclick = function () {
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
  canVerify = true;
  signButton.classList.add('sign-button-disabled');
  // console.log(data);
  previousSignature = key.sign(data, 'base64', 'utf8');
  messageSignatureOriginal.value = previousSignature;
  messageSignatureCopy.value = previousSignature;

  let newData =
    'Q.' +
    amount2.value.toString() +
    ' from ' +
    sender2.value.toString() +
    ' to ' +
    receiver2.value.toString();

  let verification = key.verify(
      newData,
      messageSignatureCopy.value.toString(),
      'utf8',
      'base64'
    );

    verificationCard.classList.remove('container-match');
    verificationCard.classList.remove('container-no-match');
};

amount1.onkeyup = function () {
  amount2.value = amount1.value;
  previousSecondAmount = amount1.value.toString();
  changeData();
  newSignature = key.sign(data, 'base64', 'utf8');

  if (previousSignature != newSignature) {
    signButton.classList.remove('sign-button-disabled');
  } else {
    signButton.classList.add('sign-button-disabled');
  }
};

sender1.onkeyup = function () {
  sender2.value = sender1.value;
  previousSecondSender = sender1.value.toString();
  changeData();
  newSignature = key.sign(data, 'base64', 'utf8');

  if (previousSignature != newSignature) {
    signButton.classList.remove('sign-button-disabled');
  } else {
    signButton.classList.add('sign-button-disabled');
  }
};

receiver1.onkeyup = function () {
  receiver2.value = receiver1.value;
  previousSecondReceiver = receiver1.value.toString();
  changeData();
  newSignature = key.sign(data, 'base64', 'utf8');

  if (previousSignature != newSignature) {
    signButton.classList.remove('sign-button-disabled');
  } else {
    signButton.classList.add('sign-button-disabled');
  }
};

amount2.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
};

sender2.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
};

receiver2.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
};

publicKey.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');

  if (publicKey.value.toString() == publicKeyValue) {
    validPublicKey = true;
  } else {
    validPublicKey = false;
  }
};

messageSignatureCopy.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
};

verifyButton.onclick = function () {
  if (canVerify) {
    let newData =
      'Q.' +
      amount2.value.toString() +
      ' from ' +
      sender2.value.toString() +
      ' to ' +
      receiver2.value.toString();

    verifyButton.classList.remove('verify-button');
    verifyButton.classList.add('verify-button-disabled');

    let verification = key.verify(
      newData,
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
