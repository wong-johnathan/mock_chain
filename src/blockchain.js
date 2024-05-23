const { createHash } = require('crypto');
const axios = require('axios');
class Blockchain {
  constructor() {
    this.chain = [];
    this.transactions = [];
    this.createBlock({
      proof: 1,
      previousHash: 0,
    });
    this.nodes = new Set(['node_1:3000', 'node_2:3000', 'node_3:3000']);
  }

  createBlock({ proof, previousHash }) {
    const block = {
      index: this.chain.length + 1,
      timestamp: new Date(),
      proof,
      previousHash,
      transactions: this.transactions,
    };
    this.transactions = [];
    this.chain.push(block);
    return block;
  }

  addTransaction({ sender, reciever, amount }) {
    this.transactions.push({
      sender,
      reciever,
      amount,
    });
    const previousBlock = this.getPreviousBlock();
    return previousBlock.index + 1;
  }

  addNode(node) {
    this.nodes.add(node);
  }

  async replaceChain() {
    const network = this.nodes;
    let longestChain = null;
    let maxLength = this.chain.length;
    for (const node of network) {
      const response = await axios.get(`http://${node}/blockchain`);
      const { length, chain } = response.data;
      if (length > maxLength && this.chainIsValid(chain)) {
        maxLength = length;
        longestChain = chain;
      }
    }
    if (longestChain) {
      this.chain = longestChain;
      return true;
    }
    return false;
  }

  getPreviousBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(previousProof) {
    let newProof = 1;
    let checkProof = false;
    while (!checkProof) {
      let hashOperation = createHash('sha256')
        .update(String(Math.pow(newProof, 2) - Math.pow(previousProof ?? 0, 2)))
        .digest('hex');

      if (hashOperation.substring(0, 4) === '0000') {
        checkProof = true;
      } else newProof += 1;
    }
    return newProof;
  }

  hash(block) {
    return createHash('sha256').update(JSON.stringify(block)).digest('hex');
  }

  chainIsValid(chain) {
    let previousBlock = chain[0];
    let blockIndex = 1;
    while (blockIndex < chain.length) {
      let block = chain[blockIndex];
      if (block.previousHash !== this.hash(previousBlock)) return false;
      let previousProof = previousBlock.proof;
      let proof = block.proof;
      let hashOperation = createHash('sha256')
        .update(String(Math.pow(proof, 2) - Math.pow(previousProof, 2)))
        .digest('hex');
      hashOperation = hashOperation.toString();
      if (hashOperation.substring(0, 4) !== '0000') return false;
      previousBlock = block;
      blockIndex += 1;
    }
    return true;
  }
}

const blockchain = new Blockchain();

module.exports = blockchain;
