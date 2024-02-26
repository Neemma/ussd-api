const express = require('express');
const router = express.Router();
const africasTalkingHelper = require('../utils/africasTalkingHelper');
const fs = require('fs');

const BLOCK_REASONS_FILE = 'block_reasons.json';

router.post('/', async (req, res) => {
  const { reason, msisdn } = req.body;

  // Validate msisdn format
  if (!isValidMsisdn(msisdn)) {
      return res.status(400).json({ code: 5001, message: 'Invalid msisdn format.' });
  }

  // Save to JSON file
  saveReasonToFile(msisdn, reason);

  try {
      const formattedMsisdn = formatMsisdn(msisdn);
      console.log(formattedMsisdn);
      console.log(reason);

      await africasTalkingHelper.sendSMS(formattedMsisdn, `Your transaction block request has been received. For Reason: ${reason}`);

      res.status(200).json({ message: 'Request to block transactions received.' });
      console.log(formattedMsisdn, reason);
  } catch (error) {
      console.error('Error sending SMS:', error);
      res.status(500).json({ message: 'Error processing request.' });
  }
});


function saveReasonToFile(msisdn, reason) {
  let blockReasons = loadBlockReasons();
  blockReasons[msisdn] = reason;

  fs.writeFileSync(BLOCK_REASONS_FILE, JSON.stringify(blockReasons));
}

function loadBlockReasons() {
  try {
    const data = fs.readFileSync(BLOCK_REASONS_FILE);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function isValidMsisdn(msisdn) {
  const msisdnRegex = /^\+254\d{9}$/;
  return msisdnRegex.test(msisdn);
}

function formatMsisdn(msisdn) {
  return msisdn.startsWith('+') ? msisdn : `+${msisdn}`;
}

module.exports = router;
