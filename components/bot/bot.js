'use strict'
/**
*  @fileoverview Bot API. General bot initialisation and actions.
*
*  @author       Marios Tzakris
*  @author       Stathis Charitos
*
*  @requires     NPM:messenger-bot
*  @requires     ./chat
*  @requires     ./jukebox
*  @requires     ./vol
*/

const http = require('http');
const MessengerBot = require('messenger-bot');

const jukebox = require('../jukebox/jukebox');
const chat = require('../chat/chat');
const vol = require('../vol/vol');

const facecbookConfig = require('../../config/facebook');

// Module Nested Actions
const actions = {
  play: jukebox.resolve,
  stop: jukebox.resolve,
  next: jukebox.resolve,
  info: jukebox.resolve,
  say: chat.resolve,
  echo: chat.resolve,
  vol:vol.resolve
};

function Bot() {

}

/** Start BeatBot.
 * @method processEvent
 * @param {String} message
 * @param {Object} next
 */
// -----
Bot.prototype.start = function () {
    const self = this;

    let messengerBot = new MessengerBot({
        token: facecbookConfig.pageToken,
        verify: facecbookConfig.verifyToken
    });


    chat.init();
    jukebox.init();
    vol.init();

    messengerBot.on('error', (err) => {
        console.log(err.message)
    });

    messengerBot.on('message', (payload, reply) => {
        let text = payload.message.text;

        messengerBot.getProfile(payload.sender.id, (err, profile) => {
            if (err) throw err;
            console.log(`Message sent from ${profile.first_name} ${profile.last_name}: ${text}`)
            self.resolveMessage(text, function(error, replyText){
                if(error) throw error;
                reply({ text: replyText }, (err) => {
                    if (err) throw err;
                })
            });
        })
    });

    http.createServer(messengerBot.middleware()).listen(8000);
    console.log('BeatBot server running at port 8000')
}

// // -----------------------------------------------------------------------------
// /** Process Bot api event.
// * @method processEvent
// * @param {String} message
//  * @param {Object} next
// */
// // -----------------------------------------------------------------------------
// Bot.prototype.processEvent = function(message, next) {
//     const self = this;
//
//   self.resolveMessage(message, function(error, replyText){
//     return next(error, replyText);
//   });
// };
// -----------------------------------------------------------------------------
/** Check if bot is being called and figure out what action take.
* @method resolveMessage
 * @param {String} message
 * @param {Object} next
*/
// -----------------------------------------------------------------------------
Bot.prototype.resolveMessage = function(message, next) {
    const self = this;
    if(message){
        // let action = message.split(' ')[0] || message;
        // let text = message.split(' ')[1] || '';
        let action = message.substring(0, message.indexOf(" ")) || message;
        let text = message.substring(message.indexOf(" ")+1) || "";
        if(action)
            action = action.toLowerCase();
        self.resolveAction(action, text, function (error, replyText) {
            return next(null, replyText)
        })
    } else {
        return next(null, 'Say something dude!')
    }
}
// -----------------------------------------------------------------------------
/** Read message and resolve to particular action based on key words. This needs
* to become smarter as a function and not rely only on key words and nested key
* word matching, it should handle phrases and conversation context (hard)
* @method resolveAction
 * @param {Object} inputAction - action.
* @param {Object} info - fb event object.
 * @param {Object} next
*/
// -----------------------------------------------------------------------------
Bot.prototype.resolveAction = function(inputAction, info, next) {
  // Check if user is asking for a suggestion. This is different from key word
  // matching since it is a phrase.
  let action = actions[inputAction];
  if (action) {
    action(inputAction, info, function (error, replyText) {
        return next(error, replyText)
    });
  } else {
      return next(null, 'Cant recognise action')
  }
};
/**
* Bot module.
* @module Api/Bot
*/
module.exports = Bot;
