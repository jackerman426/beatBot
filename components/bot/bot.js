'use strict';

const facecbookConfig = require('../../config/facebook');
const http = require('http');
const Bot = require('messenger-bot');
const resolver = require('./resolver');

function start () {

    let bot = new Bot({
        token: facecbookConfig.pageToken,
        verify: facecbookConfig.verifyToken
    });

    bot.on('error', (err) => {
        console.log(err.message)
    });

    bot.on('message', (payload, reply) => {
        let text = payload.message.text;

        bot.getProfile(payload.sender.id, (err, profile) => {
            if (err) throw err;
            console.log(`Message sent from ${profile.first_name} ${profile.last_name}: ${text}`)
            resolver.processEvent(text, function(error, replyText){
                if(error) throw error;
                reply({ text: replyText }, (err) => {
                    if (err) throw err;
                })
            });
        })
    });

    http.createServer(bot.middleware()).listen(3000);
    console.log('BeatBot server running at port 3000')
}



module.exports = {
    start: start
};