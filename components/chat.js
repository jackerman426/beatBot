/**
*  @fileoverview Chat API. Simple conversation, will add seq2seq model for
* silly conversation that does not have corresponding actions.
*
*  @author       Stathis Charitos
*
*/
// Facebook api to be added on init.
var api = null;
// Module Nested Actions
var actions = {
  echo: echo
};
// -----------------------------------------------------------------------------
/** Initialize API.
* @method init
* @param {Object} fbAPI - Facebook api instance.
*/
// -----------------------------------------------------------------------------
function init (fbAPI) {
  api = fbAPI;
}
// -----------------------------------------------------------------------------
/** Choose what action to perform.
* @method resolve
* @param {Object} message - fb event object.
* @param {Object} parts - Remaining action parts.
*/
// -----------------------------------------------------------------------------
function resolve (message, parts) {
  var key = parts[1];
  var action = actions[key];
  if (action) {
    action(message, parts.slice(1, -1));
  }
}
// -----------------------------------------------------------------------------
/** Echo message.
* @method get
* @param {Object} message - fb event object.
*/
// -----------------------------------------------------------------------------
function echo (message) {
  api.markAsRead(message.threadID, function (err) {
    if (err) console.log(err);
  });
  api.sendMessage(message.body.split(' ')[2], message.threadID);
}
/**
* Chat API.
* @module Api/Chat
*/
module.exports = {
  resolve: resolve,
  init: init
};
