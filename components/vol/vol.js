/**
*  @fileoverview Volume API. Control of raspberry volume from chat
*
*  @author       gmethe
*
*/
// Facebook api to be added on init.
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
function init () {
  run_cmd( "amixer cset numid=1 -- 0", function(text) {});
  get_current_volume()
}
// -----------------------------------------------------------------------------
/** Choose what action to perform. We only have one chat action so just call it
* @method resolve
* @param {String} action - action
* @param {String} info - String.
* @param {Object} next - return callback function
*/
// -----------------------------------------------------------------------------
function resolve (action, info, next) {
  if(actions[action])
    actions[action](info, function (error, replyText) {
        return next(error, replyText)
    });
}

function run_cmd(cmd, callBack) {
    var exec = require('child_process').exec;
    var child = exec(cmd);
    var resp = "";
    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
} // ()

function get_current_volume() {
  var value = null;
  var numberPattern = /-*\d+/g;
  run_cmd( "amixer cget numid=1", function(text) {
    if(text.match(numberPattern)){
      value = text.match(numberPattern)
      max_volume = value[3]
      min_volume = Math.max(-800, value[2])
      current_volume = value[5]
      step = (max_volume - min_volume) / 8
    }
  });

}

// -----------------------------------------------------------------------------
/** Echo message.
* @method get
* @param {Object} message.
 * @param {Object} next.
*/
// -----------------------------------------------------------------------------
function vol (message, next) {

  if(message === "vol")
      return next(null, "That's right! I can now change the volume of this fucking thing, type \"vol help\" for right usage.");
  if(message === "?")
      return next(null, "Vol: " + String(Math.round(10.0 * ((current_volume - min_volume) / (max_volume - min_volume)))) + " out of 10");
  if(message === "help")
      return next(null, "Type \"vol +(++)(max)\" & \"vol -(--)(min)\" to change the volume.");
  if(message === "+")
    current_volume = Math.min(max_volume, current_volume + step);
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "++")
    current_volume = Math.min(max_volume, current_volume + (2.0 * step))
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "+++")
    current_volume = Math.min(max_volume, current_volume + (3.0 * step))
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "max")
    current_volume = max_volume
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "-")
    current_volume = Math.max(min_volume, current_volume - step);
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "--")
    current_volume = Math.max(min_volume, current_volume - (2.0 * step))
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "---")
    current_volume = Math.max(min_volume, current_volume - (3.0 * step))
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
  if(message === "min")
    current_volume = min_volume
    run_cmd( "amixer cset numid=1 -- " + current_volume, function(text) {});
}
/**
* Chat API.
* @module Api/Chat
*/
module.exports = {
  resolve: resolve,
  init: init
};
