let EC = elliptic.elliptic().ec;
let ec = new EC('secp256k1');

let keypair = ec.genKeyPair();
if (Cookies.get('privateKey')) {
  keypair = ec.keyFromPrivate(Cookies.get('privateKey'));
}

let card1 = document.getElementById('card1');
let card2 = document.getElementById('card2');
let privateKey = document.getElementById('private-key');
let publicKey = document.getElementById('public-key');
let message1 = document.getElementById('user-message-1');
let message2 = document.getElementById('user-message-2');
let signButton = document.getElementById('sign-button');
let verifyButton = document.getElementById('verify-button');
let messageSignature1 = document.getElementById('message-signature-1');
let messageSignature2 = document.getElementById('message-signature-2');
let verified = false;

let private_key = keypair.getPrivate('hex');
let public_key = keypair.getPublic('hex');
let message_signature = sha256(message1.value) + sha256(message1.value);

card1.style.backgroundColor = 'lightgrey';
card2.style.backgroundColor = 'lightgrey';

update();

function update() {
  private_key = keypair.getPrivate('hex');
  public_key = keypair.getPublic('hex');

  privateKey.value = private_key;
  publicKey.value = public_key;

  Cookies.set('privateKey', private_key.toString());
  Cookies.set('publicKey', public_key.toString());
}

message1.onkeyup = function () {
  message2.value = message1.value;
  card1.style.backgroundColor = 'lightgrey';
};

signButton.onclick = function () {
  card1.style.backgroundColor = 'lightgreen';

  message_signature = sha256(message1.value) + sha256(message1.value);

  messageSignature1.value = message_signature;
  messageSignature2.value = message_signature;
};

message2.onkeyup = function () {
  if (message2.value !== message1.value) {
    card2.style.backgroundColor = 'coral';
  } else {
    if (verified) {
      card2.style.backgroundColor = 'lightgreen';
    } else {
      card2.style.backgroundColor = 'lightgrey';
    }
  }
};

verifyButton.onclick = function () {
  if (
    publicKey.value === public_key &&
    message2.value === message1.value &&
    messageSignature2.value === messageSignature1.value
  ) {
    card2.style.backgroundColor = 'lightgreen';
    verified = true;
  } else {
    card2.style.backgroundColor = 'coral';
  }
};
