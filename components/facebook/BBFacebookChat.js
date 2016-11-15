//Class: BBFacebook - facebook chat api
//Created:  15/11/16 - mariostzakris
//Filename: BBFacebook.js
/////////////////////////////////////////////////////////////////

var login = require("facebook-chat-api");

//Constructor
function BBFacebook() {
    this.api = null;
};

BBFacebook.prototype.login = function (username, password, next) {
    var self = this;
    if(!username || !password){
        next(new Error('Please specify username and password!'))
    }

    login({email: username, password: password}, function callback (err, api) {

        if(err) {
            console.error(err);
            return next(err)
        } else {
            self.api = api;
            return next(null)
        }
    });

};

module.exports = BBFacebook;