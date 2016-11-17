/**
*  @fileoverview Social API. Get suggestions and reminders to share things on
* your personal wall or your company's page.
*                How it should work
*                ------------------
*                Bot tell me what to post
*                Bot what should i share?
*                Bot I want to share something, give me suggestions
*
*  @author       Stathis Charitos
*
*/
// Facebook api to be added on init.
var api = null;
// Module Nested Actions
var actions = {
  suggest: suggest
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
/** Choose what action to perform. Here only action is suggest.
* @method resolve
* @param {Object} message - fb event object.
* @param {Object} parts - Remaining action parts.
*/
// -----------------------------------------------------------------------------
function resolve (message, parts) {
  actions.suggest(message);
}
// -----------------------------------------------------------------------------
/** Suggest a list of articles or links to share on your wall. Use personalised
* recommender based on profile or company info depending on the purpose.
* @method suggest
* @param {Object} message - fb event object.
*/
// -----------------------------------------------------------------------------
function suggest (message) {
  // TODO:: implement.
  api.markAsRead(message.threadID, function (err) {
    if (err) console.log(err);
  });
  api.sendMessage(
    'Sharing suggestions are not possible at the moment.',
    message.threadID
  );
}
/**
* Social API.
* @module Api/Social
*/
module.exports = {
  resolve: resolve,
  init: init
};
