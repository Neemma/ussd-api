const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const confirmPinRouter = require('./api/confirmPin');
const blockTransactionsRouter = require('./api/blockTransactions');

app.use('/confirm-pin', confirmPinRouter);
app.use('/block-transactions', blockTransactionsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
