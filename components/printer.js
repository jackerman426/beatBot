/**
*  @fileoverview Printer API. Send files to print them on local printer.
*
*  @author       Stathis Charitos
*
*/
// Facebook api to be added on init.
var api = null;
// Module Nested Actions
var actions = {
  print: print
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
/** Choose what action to perform. Here only action is print.
* @method resolve
* @param {Object} message - fb event object.
* @param {Object} parts - Remaining action parts.
*/
// -----------------------------------------------------------------------------
function resolve (message, parts) {
  actions.print(message);
}
// -----------------------------------------------------------------------------
/** Print a file sent through facebook, using a connected printer.
* @method print
* @param {Object} message - fb event object.
*/
// -----------------------------------------------------------------------------
function print (message) {
  // TODO:: implement.
  api.markAsRead(message.threadID, function (err) {
    if (err) console.log(err);
  });
  api.sendMessage('Printing is not possible at the moment.', message.threadID);
}
/**
* Print API.
* @module Api/Print
*/
module.exports = {
  resolve: resolve,
  init: init
};
