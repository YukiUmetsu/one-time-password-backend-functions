const admin = require('firebase-admin');
const Utils = require('./utils');
module.exports = function (req, res) {
    if(!req.body.phone || !req.body.code){
        return res.status(422).send({ error: 'phone and code must be provided '});
    }

    const phone = Utils.formatPhoneNumber(req.body.phone);
    const code = parseInt(req.body.code);

    admin.auth().getUser(phone)
        .then(()=>{
            const ref = admin.database().ref('users/'+phone);
            ref.on('value', snapshot => {
                // after getting a value one time, stop subscribe.
                ref.off();
                const user = snapshot.val();

                if(user.code !== code || !user.codeValid){
                    return res.status(422).send({ error: 'Code not valid'});
                }

                ref.update({ codeValid: false});
                admin.auth().createCustomToken(phone)
                    .then(token => res.send({ token: token}))
            });
        })
        .catch((err)=> {
           res.status(422).send({ error: err});
        });
};