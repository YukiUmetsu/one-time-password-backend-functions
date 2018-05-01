const Utils = require('./utils');
const admin = require('firebase-admin');
const twilio = require('./twilio');
const twilioPhoneNumber = require('./config/twilio-dev').twilioPhoneNumber;

module.exports = function (req, res) {
  if(!req.body.phone){
      return res.status(422).send({ error: 'You must provide a phone number'});
  }

  const phone = Utils.formatPhoneNumber(req.body.phone);

    admin.auth().getUser(phone)
        .then(userRecord => {
            const code = Math.floor((Math.random()*8999 + 1000));
            return sendMessageWithTwilio(code, phone);
        })
        .catch((err) => {
            res.status(422).send({error: err});
        });

    function sendMessageWithTwilio(code, phone){
        twilio.messages.create({
            body: 'Your code is '+ code,
            to: phone,
            from: twilioPhoneNumber
        }, (err)=> {
            if(err){ return res.status(422).send({err}); }

            admin.database().ref('users/'+phone)
                .update({code: code, codeValid: true }, ()=>{
                    res.send({ success: true });
                })
        });
    }
};