const express = require('express');
const blockchain = require('./blockchain');
const { randomUUID } = require('crypto');
const router = express.Router();

const nodeAddress = `${randomUUID().replaceAll('-', '')}`;
router.get('/', (req, res) => {
  res.json({
    chain: blockchain.chain,
    length: blockchain.chain.length,
  });
});

router.post('/transaction', (req, res) => {
  const { sender, reciever, amount } = req.body;
  const errors = [];
  if (!sender) errors.push('Sender is required');
  if (!reciever) errors.push('Reciever is required');
  if (!amount) errors.push('Amount is required');
  if (errors.length > 0) return res.status(400).send({ errors });

  const blockIndex = blockchain.addTransaction({ sender, reciever, amount });
  res.send({ message: `Transaction will be added to Block ${blockIndex}` });
});
router.get('/mine', (req, res) => {
  const previousBlock = blockchain.getPreviousBlock();
  const previousProof = previousBlock.proof;
  const proof = blockchain.proofOfWork(previousProof);
  const previousHash = blockchain.hash(previousBlock);
  blockchain.addTransaction({ sender: nodeAddress, reciever: 'You', amount: 1 });
  const block = blockchain.createBlock({
    proof,
    previousHash,
  });
  res.json({
    message: 'Congratulations, you just mined a block!',
    block: block,
  });
});

router.get('/valid', (req, res) => {
  const isValid = blockchain.chainIsValid(blockchain.chain);
  res.json({ isValid });
});

router.get('/hash/:block', (req, res) => {
  const block = blockchain.chain[req.params.block];
  res.json({ hash: blockchain.hash(block) });
});

router.post('/connect_node', (req, res) => {
  const { nodes } = req.body;
  if (!nodes || nodes.length === 0) return res.status(400).send('Node required');
  for (const node of nodes) blockchain.addNode(node);
  res.send({ message: `All nodes are now connected. The blockchain now contains the following nodes: ${Array.from(blockchain.nodes)}` });
});

router.get('/replace_chain', async (req, res) => {
  const replaced = await blockchain.replaceChain();
  const message = replaced ? 'Chain was replaced' : 'Chain is the largest';
  if (replaced) return res.json({ message, newChain: blockchain.chain });
  res.json({ message });
});

module.exports = router;
