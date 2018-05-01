const admin = require('firebase-admin');
const Utils = require('./utils');

module.exports = function(req, res){

    if(!req.body.phone){
        return res.status(422).send({error: 'Bad Input'});
    }

    const phone = Utils.formatPhoneNumber(req.body.phone);

    admin.auth().createUser({ uid: phone })
        .then(user => res.send(user))
        .catch(error => res.status(422).send({ error }));
};