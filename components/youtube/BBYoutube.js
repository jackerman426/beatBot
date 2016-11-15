//Class: BBYoutube - youtube node
//Created:  15/11/16 - mariostzakris
//Filename: BBYoutube.js
/////////////////////////////////////////////////////////////////

var getYouTubeID = require('get-youtube-id');
var YouTube = require('youtube-node');

//Constructor
function BBYoutube() {
    this.api = null;
};

BBYoutube.prototype.initialize = function (apiKey, next) {
    var self = this;
    if(!apiKey){
        next(new Error('Please specify youtube api key'));
    }
    self.api = new YouTube();
    self.api.setKey(apiKey);
    return next(null)
};



module.exports = BBYoutube;