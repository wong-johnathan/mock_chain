const express = require('express');
const app = express();
const blockchainRouter = require('./routes');
const blockchain = require('./blockchain');

app.use(express.json());
app.use('/blockchain', blockchainRouter);

app.use('/', (req, res) => res.send('OK'));

app.listen(process.env.PORT ?? 3000, () => {
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  setInterval(async () => await blockchain.replaceChain(), 1000);
});
