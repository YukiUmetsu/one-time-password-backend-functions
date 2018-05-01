const twilio = require('twilio');
const accountSid = require('./config/twilio-dev').accountSid;
const authToken = require('./config/twilio-dev').authToken;

module.exports = new twilio.Twilio(accountSid, authToken);