let EC = elliptic.elliptic().ec;
let ec = new EC('secp256k1');

let keypair = ec.genKeyPair();
if (Cookies.get('privateKey')) {
  keypair = ec.keyFromPrivate(Cookies.get('privateKey'));
}

let privateKey = document.getElementById('private-key');
let publicKey = document.getElementById('public-key');
let randomButton = document.getElementById('random-button');

let prv = keypair.getPrivate('hex');
let pub = keypair.getPublic('hex');

update();

function update() {
  prv = keypair.getPrivate('hex');
  pub = keypair.getPublic('hex');

  privateKey.value = prv;
  publicKey.value = pub;

  Cookies.set('privateKey', prv.toString());
  Cookies.set('publicKey', pub.toString());
  // console.log(prv);
}

function random() {
  keypair = ec.genKeyPair();
  update();
}

randomButton.onclick = function () {
  random();
};
