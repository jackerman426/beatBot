var facebookConfig = require('../config/facebook');

var login = require('facebook-chat-api');
var chat = require('./chat');
var jukebox = require('./jukebox');

var actions = {
    play: jukebox.play,
    stop: jukebox.stop,
    say: chat.hi
};

// Initialize FB event listener
function start (callback) {
    login({
        email: facebookConfig.username,
        password: facebookConfig.password
    }, function callback (error, api) {
        if (error) return console.error(error);
        // inject ?
        chat.init(api);
        jukebox.init(api);
        console.log('Listening...');
        api.listen(processEvent);
    });
}

function processEvent (error, message) {
    if (error) console.log(error);
    resolveMessage(message);
}

function resolveMessage (message) {
    // Detect if someone is talking to you.
    var areYouTalkingToMe = message.body.startsWith(facebookConfig.nickname);
    // If its not about you stay out.
    if (!areYouTalkingToMe) return 0;
    // Otherwise locate action
    resolveAction(message);
}

function resolveAction (message) {
    // If it is something like this. BeatBot play <url>
    var parts = message.body.split(' ');
    var key = parts[1];
    var action = actions[key];
    if (action) {
        action(message);
    }
}

module.exports = {
    start: start
};