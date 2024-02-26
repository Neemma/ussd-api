const dotenv = require('dotenv').config();
const AfricasTalking = require('africastalking')({
    apiKey: process.env.AFRICAS_TALKING_API_KEY,
    username: process.env.AFRICAS_TALKING_USERNAME
});

async function sendSMS(to, message) {
    try {
        const sms = AfricasTalking.SMS;
        await sms.send({ to, message }); 
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

module.exports = { sendSMS };
