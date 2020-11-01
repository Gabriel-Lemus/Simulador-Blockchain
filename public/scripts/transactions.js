let SHA256 = require('crypto-js/sha256');
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
let randomButton = document.getElementById('assign-rand-values');
let checkBox = document.getElementById('show-addresses');

let key;
let otherKey;
let publicKeyValue;
let privateKey_;
let privateKeyValue;
let senderName;
let receiverName;
let senderAddress;
let receiverAddress;
let previousSignature;
let newSignature;
let canVerify = false;
let validPublicKey = true;
let data;

let names = [
  'Alejandro',
  'Daniel',
  'Hernán',
  'Luis',
  'Raúl',
  'Enrique',
  'Lucía',
  'Ricardo',
  'María',
  'Mauricio',
  'Paula',
  'Laura',
  'Andrea',
  'Ana',
  'Claudia',
  'David',
  'Pablo',
  'Adrián',
  'Javier',
  'Álvaro',
  'Diego',
  'Carla',
  'Cristina',
  'Iván',
  'Carolina',
  'Alicia',
  'Juan',
  'Mónica',
  'Andrés',
  'Antonio',
  'Julio',
  'Paula',
  'Rodrigo',
  'Luis',
  'Tomás',
  'Gerardo',
  'Víctor',
  'Gonzalo',
  'Martín',
  'Diana',
  'Susana',
  'Adriana',
  'Julieta',
  'Karla',
  'Ernesto',
  'Felipe',
  'Héctor',
  'Omar',
  'Mario',
  'Enrique',
];

function assignRandomValues() {
  otherKey = new NodeRSA({ b: 512 });
  senderAddress = SHA256(
    otherKey.exportKey('private').toString().slice(32, 121)
  ).toString();
  receiverAddress = SHA256(
    otherKey.exportKey('public').toString().slice(27, 79)
  ).toString();

  let firstNumber = Math.floor(Math.random() * names.length);
  let secondNumber = Math.floor(Math.random() * names.length);

  while (secondNumber == firstNumber) {
    secondNumber = Math.floor(Math.random() * names.length);
  }

  senderName = names[firstNumber];
  receiverName = names[secondNumber];

  sender1.value = senderName;
  sender2.value = sender1.value;
  receiver1.value = receiverName;
  receiver2.value = receiver1.value;
  amount1.value = (
    Math.floor(Math.random() * (1000 * 100 - 1 * 100) + 1 * 100) /
    (1 * 100)
  ).toLocaleString(undefined, { minimumFractionDigits: 2 });
  amount2.value = amount1.value;
}

setKeys();
assignRandomValues();
changeData();

function restoreCard() {
  verificationCard.classList.remove('container-match');
  verificationCard.classList.remove('container-no-match');
}

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

function changeData() {
  data =
    'Q.' +
    amount1.value.toString() +
    ' from ' +
    sender1.value.toString() +
    ' to ' +
    receiver1.value.toString();
}

checkBox.onchange = function () {
  if (checkBox.checked) {
    sender1.value = senderAddress;
    sender2.value = senderAddress;
    receiver1.value = receiverAddress;
    receiver2.value = receiverAddress;
  } else {
    sender1.value = senderName;
    sender2.value = senderName;
    receiver1.value = receiverName;
    receiver2.value = receiverName;
  }
};

randomButton.onclick = function () {
  assignRandomValues();
  changeData();

  signButton.classList.remove('sign-button-disabled');
  signButton.classList.add('sign-button-enabled');

  if (checkBox.checked) {
    checkBox.checked = false;
  }
};

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
  restoreCard();
};

sender2.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
  restoreCard();
};

receiver2.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
  restoreCard();
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

  restoreCard();
};

messageSignatureCopy.onkeyup = function () {
  canVerify = true;
  verifyButton.classList.remove('verify-button-disabled');
  verifyButton.classList.add('verify-button');
  restoreCard();
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

    let otherData =
      'Q.' +
      amount2.value.toString() +
      ' from ' +
      senderName +
      ' to ' +
      receiverName;

    let otherVerification = key.verify(
      otherData,
      messageSignatureCopy.value.toString(),
      'utf8',
      'base64'
    );

    if (!checkBox.checked) {
      if (verification && validPublicKey) {
        verificationCard.classList.remove('container-no-match');
        verificationCard.classList.add('container-match');
      } else {
        verificationCard.classList.remove('container-match');
        verificationCard.classList.add('container-no-match');
      }
    } else {
      if (
        (sender2.value == sender1.value &&
          receiver2.value == receiver1.value &&
          validPublicKey) &&
        otherVerification
      ) {
        verificationCard.classList.remove('container-no-match');
        verificationCard.classList.add('container-match');
      } else {
        verificationCard.classList.remove('container-match');
        verificationCard.classList.add('container-no-match');
      }
    }

    canVerify = false;
  }
};
