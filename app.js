const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const confirmPinRouter = require('./routes/confirmPin');
const blockTransactionsRouter = require('./routes/blockTransactions');

app.use('/confirm-pin', confirmPinRouter);
app.use('/block-transactions', blockTransactionsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
