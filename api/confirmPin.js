const express = require('express');
const router = express.Router();

const MAX_RETRIES = 3;

let retries = {}; 
let sessionActive = {}; 

router.post('/', async (req, res) => {
  const { pin, msisdn } = req.body;

  if (!isValidPayload(req.body)) {
    return res.status(400).json({ code: 5001, message: 'Invalid request payload. Expected keys: pin, msisdn.' });
  }

  if (!retries[msisdn]) {
    retries[msisdn] = 0; 
    sessionActive[msisdn] = true;
  }

  const correctPin = '1234';

  if (!sessionActive[msisdn]) {
    return res.status(400).json({ code: 5000, message: 'Session terminated. Max retries exceeded.' });
  }

  if (pin !== correctPin) {
    retries[msisdn]++;
    console.log(`MSISDN ${msisdn} Retries:`, retries[msisdn]); 

    if (retries[msisdn] >= MAX_RETRIES) {
      sessionActive[msisdn] = false; // Terminate session upon exceeding max retries
      return res.status(400).json({ code: 5000, message: 'Wrong PIN. Max retries exceeded. Session terminated.' });
    } else {
      return res.status(400).json({ code: 5000, message: 'Wrong PIN.' });
    }
  }

  // PIN is correct
  delete retries[msisdn]; 
  sessionActive[msisdn] = false; 
  res.status(200).json({ code: 4000, message: 'PIN accepted.' });
});

function isValidPayload(payload) {
  return 'pin' in payload && 'msisdn' in payload;
}

module.exports = router;
