let SHA256 = require('crypto-js/sha256');
let NodeRSA = require('node-rsa');

window.sha256 = function (data) {
  return SHA256(data).toString();
};

class Transaction {
  constructor(sender, senderAddress, receiver, receiverAddress, amount) {
    this.sender = sender;
    this.senderAddress = senderAddress;
    this.receiver = receiver;
    this.receiverAddress = receiverAddress;
    this.amount = amount;
  }

  get description() {
    return (
      'Q.' +
      this.amount.toLocaleString() +
      ' de ' +
      this.sender +
      ' para ' +
      this.receiver +
      '.'
    );
  }

  get longDescription() {
    return (
      'Q.' +
      this.amount.toLocaleString() +
      ' de ' +
      this.senderAddress +
      ' para ' +
      this.receiverAddress +
      '.'
    );
  }
}

class Block {
  constructor(number, transaction, previousHash, securityNumber) {
    this.number = number;
    this.transaction = transaction;
    this.previousHash = previousHash;
    this.securityNumber = securityNumber;
    this.isMined = false;
  }

  mineBlock() {
    let nonceNumber = 0;

    while (!this.isMined) {
      let minedData = SHA256(
        this.number +
          nonceNumber.toString() +
          this.transaction.description +
          this.previousHash
      ).toString();

      if (
        minedData.slice(0, this.securityNumber) ==
        '0'.repeat(this.securityNumber)
      ) {
        this.isMined = true;
        this.nonce = nonceNumber.toLocaleString();
        this.hash = minedData;
      } else {
        nonceNumber += 1;
      }
    }
  }

  isBlockMined() {
    return this.isMined;
  }

  changeSecurityNumber(newSecurityNumber) {
    this.securityNumber = newSecurityNumber;
    this.isMined = false;
  }
}

class Blockchain {
  constructor(
    sender,
    senderAddress,
    receiver,
    receiverAddress,
    amount,
    securityNumber
  ) {
    let firstTransaction = new Transaction(
      sender,
      senderAddress,
      receiver,
      receiverAddress,
      amount
    );
    let genesisBlock = new Block(
      1,
      firstTransaction,
      '0'.repeat(64),
      securityNumber
    );
    // genesisBlock.mineBlock();

    this.blockList = [genesisBlock];
    this.length = 1;
    this.securityNumber = securityNumber;
  }

  addBlock(sender, senderAddress, receiver, receiverAddress, amount) {
    let newTransaction = new Transaction(
      sender,
      senderAddress,
      receiver,
      receiverAddress,
      amount
    );
    let newBlock = new Block(
      this.length + 1,
      newTransaction,
      this.blockList[this.length - 1].hash,
      this.securityNumber
    );
    // newBlock.mineBlock();

    this.length += 1;
    this.blockList.push(newBlock);
  }

  remineBlocks() {
    for (let i = 0; i < this.blockList.length; i++) {
      this.blockList[i].changeSecurityNumber(this.securityNumber);
      this.blockList[i].mineBlock();

      if (i != 0) {
        this.blockList[i].previousHash = this.blockList[i - 1].hash;
      }
    }
  }

  changeSecurityNumber(newSecurityNumber) {
    this.securityNumber = newSecurityNumber;
    this.remineBlocks();
  }

  get description() {
    let data = '';
    // console.log('Number of blocks: ' + this.blockList.length);

    for (let i = 0; i < this.blockList.length; i++) {
      data +=
        'Block number: ' +
        this.blockList[i].number +
        '\n' +
        'Transaction: ' +
        this.blockList[i].transaction.description +
        '\n' +
        'Sender name: ' +
        this.blockList[i].transaction.sender +
        '\n' +
        'Receiver name: ' +
        this.blockList[i].transaction.receiver +
        '\n' +
        'Sender address: ' +
        this.blockList[i].transaction.senderAddress +
        '\n' +
        'Receiver address: ' +
        this.blockList[i].transaction.receiverAddress +
        '\n' +
        'Nonce: ' +
        this.blockList[i].nonce +
        '\n' +
        'Hash: ' +
        this.blockList[i].hash +
        '\n' +
        'Previous hash: ' +
        this.blockList[i].previousHash +
        '\n';

      if (i !== this.blockList.length - 1) {
        data += '\n';
      }
    }

    return data;
  }
}

class Peer {
  constructor(number, contributions) {
    this.number = number;
    this.contributions = contributions;
  }

  addContribution(contribution) {
    this.contributions += contribution;
  }
}

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

let amount = document.getElementById('amount');
let sender = document.getElementById('sender');
let receiver = document.getElementById('receiver');
let addBlockButton = document.getElementById('add-trx-button');
let randomButton = document.getElementById('random-trx-button');
let undoButton = document.getElementById('undo-trx-button');
let checkBox = document.getElementById('show-addresses');
let addPeersButton = document.getElementById('add-peers-button');
let peersSpace = document.getElementById('peers');
let peersNumber = document.getElementById('peers-number');

let blockchain;
let securityNumber = 4;

let key;
let publicKey;
let privateKey;
let senderName;
let senderAddress;
let receiverName;
let receiverAddress;

let peers = 3;
let maxPeers = 5;
let initialBlocks = 3;

assignRandomValues();
peersNumber.innerHTML = 'Número de Peers: 3';
getInitialContributions();

function assignRandomValues() {
  key = new NodeRSA({ b: 256 });
  publicKey = key.exportKey('public').toString().slice(27, 79);
  let privateKey_ = key.exportKey('private').toString().slice(32, 121);
  privateKey = '';

  for (let i = 0; i < privateKey_.length; i++) {
    if (privateKey_[i] != '\n') {
      privateKey += privateKey_[i];
    }
  }

  let firstNumber = Math.floor(Math.random() * names.length);
  let secondNumber = Math.floor(Math.random() * names.length);

  while (secondNumber == firstNumber) {
    secondNumber = Math.floor(Math.random() * names.length);
  }

  sender.value = names[firstNumber];
  senderName = sender.value.toString();
  senderAddress = SHA256(privateKey).toString();
  receiver.value = names[secondNumber];
  receiverAddress = SHA256(publicKey).toString();
  receiverName = receiver.value.toString();
  amount.value = (
    Math.floor(Math.random() * (1000000 * 100 - 1 * 100) + 1 * 100) /
    (1 * 100)
  ).toLocaleString(undefined, { minimumFractionDigits: 2 });
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

function getInitialContributions() {
  let firstPeer = Math.floor(Math.random() * 4);
  let secondPeer = Math.floor(Math.random() * 4);
  let thirdPeer;

  while (firstPeer + secondPeer > 3) {
    secondPeer = Math.floor(Math.random() * (firstPeer + 1));
  }

  thirdPeer = 3 - (firstPeer + secondPeer);

  let contributions = [firstPeer, secondPeer, thirdPeer];

  for (let i = 0; i < 3; i++) {
    document.getElementById('peer-desc-' + (i + 1).toString()).innerHTML =
      'Peer #' +
      (i + 1).toString() +
      ' - Contribuciones: ' +
      contributions[i].toString();
  }

  blockchain = new Blockchain(
    senderName,
    senderAddress,
    receiverName,
    receiverAddress,
    parseFloat(removeCommas(amount.value.toString())),
    4
  );

  for (let i = 0; i < 2; i++) {
    assignRandomValues();
    blockchain.addBlock(
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      parseFloat(removeCommas(amount.value.toString()))
    );
  }

  blockchain.remineBlocks();
  // console.log(blockchain.description);

  for (let i = 0; i < initialBlocks; i++) {
    let send = blockchain.blockList[i].transaction.sender;
    let sendAddress = blockchain.blockList[i].transaction.senderAddress;
    let receive = blockchain.blockList[i].transaction.receiver;
    let receiveAddress = blockchain.blockList[i].transaction.receiverAddress;
    let quantity = blockchain.blockList[i].transaction.amount;

    for (let j = 0; j < peers; j++) {
      addBlockToBlockchain(
        send,
        sendAddress,
        receive,
        receiveAddress,
        quantity,
        j + 1,
        i + 1
      );
    }
  }
}

function canAddBlocks() {
  for (let i = 0; i < blockchain.blockList.length; i++) {
    if (!blockchain.blockList[i].isMined) {
      return false;
    }
  }

  return true;
}

function addBlockToBlockchain(
  sender,
  senderAddress,
  receiver,
  receiverAddress,
  amount,
  blockchainNumber,
  blockNumber
) {
  if (blockNumber == 0) {
    blockchain = new Blockchain(
      sender,
      senderAddress,
      receiver,
      receiverAddress,
      amount,
      securityNumber
    );
  } else {
    blockchain.addBlock(
      sender,
      senderAddress,
      receiver,
      receiverAddress,
      amount
    );
  }

  let blockchainNumberSpace = document.getElementById(
    'peer-' + blockchainNumber.toString()
  );

  let block = document.createElement('div');
  block.id =
    'blockchain-' +
    blockchainNumber.toString() +
    '-block-' +
    blockNumber.toString();
  block.classList.add('blockchain-block');
  block.classList.add('block-mined');

  let blockData = document.createElement('div');
  blockData.id = 'block-data';

  let numberTag = document.createElement('p');
  numberTag.classList.add('text');
  numberTag.innerHTML = 'Bloque #';

  let separatorDiv1 = document.createElement('div');
  separatorDiv1.style.height = '5px';
  let separatorDiv2 = document.createElement('div');
  separatorDiv2.style.height = '5px';
  let separatorDiv3 = document.createElement('div');
  separatorDiv3.style.height = '5px';
  let separatorDiv4 = document.createElement('div');
  separatorDiv4.style.height = '5px';
  let separatorDiv5 = document.createElement('div');
  separatorDiv5.style.height = '5px';

  let sepDiv1 = document.createElement('div');
  sepDiv1.classList.add('separator');
  let sepDiv2 = document.createElement('div');
  sepDiv2.classList.add('separator');
  let sepDiv3 = document.createElement('div');
  sepDiv3.classList.add('separator');
  let sepDiv4 = document.createElement('div');
  sepDiv4.classList.add('separator');
  let sepDiv5 = document.createElement('div');
  sepDiv5.classList.add('separator');

  let blockNum = document.createElement('input');
  blockNum.classList.add('block-info');
  blockNum.type = 'text';
  blockNum.readOnly = true;
  blockNum.value = blockNumber;

  let nonceTag = document.createElement('p');
  nonceTag.classList.add('text');
  nonceTag.innerHTML = 'Nonce:';

  let nonceVal = document.createElement('input');
  nonceVal.classList.add('block-info');
  nonceVal.id =
    'nonce-' + blockchainNumber.toString() + '-' + blockNumber.toString();
  nonceVal.readOnly = true;
  nonceVal.type = 'text';
  nonceVal.value = blockchain.blockList[blockNumber - 1].nonce;

  let trxTag = document.createElement('p');
  trxTag.classList.add('text');
  trxTag.innerHTML = 'Transacción:';

  let trxVal = document.createElement('input');
  trxVal.classList.add('block-info');
  trxVal.id =
    'trx-' + blockchainNumber.toString() + '-' + blockNumber.toString();
  trxVal.type = 'text';
  // trxVal.readOnly = true;
  if (checkBox.checked) {
    trxVal.value =
      blockchain.blockList[blockNumber - 1].transaction.longDescription;
  } else {
    trxVal.value =
      blockchain.blockList[blockNumber - 1].transaction.description;
  }

  let hashTag = document.createElement('p');
  hashTag.classList.add('text');
  hashTag.innerHTML = 'Hash:';

  let hashVal = document.createElement('input');
  hashVal.classList.add('block-info');
  hashVal.id =
    'hash-' + blockNumber.toString() + '-' + blockchainNumber.toString();
  hashVal.type = 'text';
  hashVal.readOnly = true;
  hashVal.value = blockchain.blockList[blockNumber - 1].hash;

  let prevHashTag = document.createElement('p');
  prevHashTag.classList.add('text');
  prevHashTag.innerHTML = 'Hash Anterior:';

  let prevHashVal = document.createElement('input');
  prevHashVal.classList.add('block-info');
  prevHashVal.type = 'text';
  prevHashVal.readOnly = true;
  prevHashVal.value = blockchain.blockList[blockNumber - 1].previousHash;

  blockData.appendChild(numberTag);
  blockData.appendChild(separatorDiv1);
  blockData.appendChild(blockNum);
  blockData.appendChild(sepDiv1);
  blockData.appendChild(nonceTag);
  blockData.appendChild(separatorDiv2);
  blockData.appendChild(nonceVal);
  blockData.appendChild(sepDiv2);
  blockData.appendChild(trxTag);
  blockData.appendChild(separatorDiv3);
  blockData.appendChild(trxVal);
  blockData.appendChild(sepDiv3);
  blockData.appendChild(hashTag);
  blockData.appendChild(separatorDiv4);
  blockData.appendChild(hashVal);
  blockData.appendChild(sepDiv4);
  blockData.appendChild(prevHashTag);
  blockData.appendChild(separatorDiv5);
  blockData.appendChild(prevHashVal);
  blockData.appendChild(sepDiv5);

  block.appendChild(blockData);
  blockchainNumberSpace.appendChild(block);

  // console.log(blockchain.description);
}

addBlockButton.onclick = function () {
  if (blockNumber == 0 || canAddBlocks()) {
    addBlockButton.classList.add('disabled');
    addBlockButton.classList.remove('enabled');

    addBlockToBlockchain(
      senderName,
      senderAddress,
      receiverName,
      receiverAddress,
      parseFloat(removeCommas(amount.value.toString()))
    );
  }

  addBlockButton.classList.remove('enabled');
  addBlockButton.classList.add('disabled');
  undoButton.classList.remove('enabled');
  undoButton.classList.add('disabled');
};

randomButton.onclick = assignRandomValues;

undoButton.onclick = function () {
  if (canAddBlocks()) {
    let sender = blockchain.blockList[blockNumber - 1].transaction.receiver;
    let receiver = blockchain.blockList[blockNumber - 1].transaction.sender;
    let amount = blockchain.blockList[blockNumber - 1].transaction.amount;

    addBlockToBlockchain(
      sender,
      senderAddress,
      receiver,
      receiverAddress,
      amount
    );

    addBlockButton.classList.remove('enabled');
    addBlockButton.classList.add('disabled');
    undoButton.classList.remove('enabled');
    undoButton.classList.add('disabled');
  }
};

checkBox.onchange = function () {
  if (checkBox.checked) {
    sender.value = senderAddress;
    receiver.value = receiverAddress;
  } else {
    sender.value = senderName;
    receiver.value = receiverName;
  }

  if (blockchain.blockList.length >= 1) {
    for (let i = 0; i < peers; i++) {
      for (let j = 0; j < blockchain.blockList.length; j++) {
        if (checkBox.checked) {
          document.getElementById(
            'trx-' + (i + 1).toString() + '-' + (j + 1).toString()
          ).value = blockchain.blockList[j].transaction.longDescription;
        } else {
          document.getElementById(
            'trx-' + (i + 1).toString() + '-' + (j + 1).toString()
          ).value = blockchain.blockList[j].transaction.description;
        }
      }
    }
  }
};

addPeersButton.onclick = function () {
  if (peers < maxPeers) {
    peers += 1;

    let peerDiv = document.createElement('div');
    peerDiv.classList.add('blockchain');

    let peerDesc = document.createElement('p');
    peerDesc.classList.add('text');
    peerDesc.innerHTML = 'Peer #' + peers.toString() + ' - Contribuciones: 0';
    peerDesc.style.margin = '15px auto 0 auto';

    peerDiv.appendChild(peerDesc);
    peersSpace.appendChild(peerDiv);
    peersNumber.innerHTML = 'Número de Peers: ' + peers.toString();

    if (peers == 5) {
      addPeersButton.classList.remove('enabled');
      addPeersButton.classList.add('disabled');
    }
  }
};
