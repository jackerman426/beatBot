'use strict'
/**
*  @fileoverview Bot API. General bot initialisation and actions.
*
*  @author       Marios Tzakris
*  @author       Stathis Charitos
*
*  @requires     NPM:facebook-chat-api
*  @requires     ../config/facebook
*  @requires     ./chat
*  @requires     ./jukebox
*  @requires     ./vol
*/
const jukebox = require('../jukebox/jukebox');
const vol = require('../vol/vol');
const chat = require('../chat/chat');

// Module Nested Actions
var actions = {
  play: jukebox.resolve,
  stop: jukebox.resolve,
  next: jukebox.resolve,
  info: jukebox.resolve,
  say: chat.resolve,
  echo: chat.resolve,
  vol:vol.resolve
};

// -----------------------------------------------------------------------------
/** Process FB api event.
* @method processEvent
* @param {String} message
 * @param {Object} next
*/
// -----------------------------------------------------------------------------
function processEvent (message, next) {
  resolveMessage(message, function(error, replyText){
    return next(error, replyText);
  });
}
// -----------------------------------------------------------------------------
/** Check if bot is being called and figure out what action take.
* @method resolveMessage
 * @param {String} message
 * @param {Object} next
*/
// -----------------------------------------------------------------------------
function resolveMessage (message, next) {

    if(message){
        // let action = message.split(' ')[0] || message;
        // let text = message.split(' ')[1] || '';
        let action = message.substring(0, message.indexOf(" ")) || message;
        let text = message.substring(message.indexOf(" ")+1) || "";
        if(action)
            action = action.toLowerCase();
            resolveAction(action, text, function (error, replyText) {
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
function resolveAction (inputAction, info, next) {
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
}
/**
* Bot module.
* @module Api/Bot
*/
module.exports = {
    processEvent: processEvent
};
