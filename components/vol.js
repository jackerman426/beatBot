/**
*  @fileoverview Volume API. Control of raspberry volume from chat
*
*  @author       gmethe
*
*/
// Facebook api to be added on init.
var api = null;
var current_volume = null;
var min_volume = null;
var max_volume = null;
var step = null;
// Module Nested Actions
var actions = {
  vol: vol
};
// -----------------------------------------------------------------------------
/** Initialize API.
* @method init
* @param {Object} fbAPI - Facebook api instance.
*/
// -----------------------------------------------------------------------------
function init (fbAPI) {
  api = fbAPI;
  get_current_volume()
}
// -----------------------------------------------------------------------------
/** Choose what action to perform. We only have one chat action so just call it
* @method resolve
* @param {Object} message - fb event object.
* @param {Object} parts - Remaining action parts.
*/
// -----------------------------------------------------------------------------
function resolve (action, info, threadId) {
  console.log(info)
  if(actions[action])
    actions[action](info, threadId);
}

function run_cmd(cmd, callBack) {
    var exec = require('child_process').exec;
    var child = exec(cmd);
    var resp = "";
    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
} // ()

function get_current_volume() {
  var value;
  var numberPattern = /-*\d+/g;
  run_cmd( "amixer cget numid=1", function(text) { value = text });
  if(value.match(numberPattern)){
    value = console.log(value.match(numberPattern))
    max_volume = value[2]
    min_volume = max(-400, value[3])
    current_volume = value[5]
    step = (max_volume - min_volume) / 5
  }
}

// -----------------------------------------------------------------------------
/** Echo message.
* @method get
* @param {Object} info.
 * @param {Object} threadId
*/
// -----------------------------------------------------------------------------
function vol (message, threadId) {

  if(message == "vol")
    api.sendMessage("That's right! I can now change the volume of this fucking thing, type \"vol help\" for right usage.", threadId);
  if(message == "?")
    api.sendMessage(current_volume, threadId);
  if(message == "help")
    api.sendMessage("Type \"vol +\" & \"vol -\" to change the volume.", threadId);
  if(message == "+")
    current_volume = min(max_volume, current_volume + step)
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) { console.log (text) });
  if(message == "-")
    current_volume = max(min_volume, current_volume - step)
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) { console.log (text) });
}
/**
* Chat API.
* @module Api/Chat
*/
module.exports = {
  resolve: resolve,
  init: init
};
