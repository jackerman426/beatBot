/**
*  @fileoverview Jukebox API. Plays youtube links on pc speaker.
*                General Usage
*                -------------
*                Bot stop
*                Bot play <youtubeurl>
*
*  @author       Marios Tzakris
*
*  @requires     NPM:get-youtube-id
*  @requires     NPM:youtube-node
*  @requires     NPM:ytdl-core
*  @requires     NPM:fluent-ffmpeg
*  @requires     NPM:lame
*  @requires     NPM:speaker
*  @requires     NPM:lodash
*  @requires     ../config/youtube
*/
var getYouTubeID = require('get-youtube-id');
var YouTube = require('youtube-node');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var lame = require('lame');
var Speaker = require('speaker');
global['_'] = require('lodash');
var youtubeConfig = require('../config/youtube');
var _ = global['_'];
var api = null;
// Initialize youtube api.
var ytBaseUrl = 'https://www.youtube.com/watch?v=';
var youTube = new YouTube();
youTube.setKey(youtubeConfig.apiKey);
var speaker = null;

var ytId = null;

//flag that helps us define where the input comes from
var userInputFlag = false;

// Module Nested Actions
var actions = {
  play: play,
  stop: stop,
  next: next
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
* @param {String} action - fb event object.
* @param {String} info
 * @param {String} threadId
*/
// -----------------------------------------------------------------------------
function resolve (action, info, threadId) {
  if(actions[action])
    userInputFlag = true;
    actions[action](info, threadId);
}
// -----------------------------------------------------------------------------
/** Play youtube link.
* @method play
* @param {Object} url - url of youtube.
*/
// -----------------------------------------------------------------------------
function play (query) {
  ytId = getYouTubeID(query);
  if (ytId) {
    stop();
    playSong(ytId);
  } else {
      searchSong(query, function(error, songId){
        if(songId){
          stop();
          ytId = songId;
          playSong(songId);
      }
    })

  }
}
// -----------------------------------------------------------------------------
/** Stop playing.
* @method stop
*/
// -----------------------------------------------------------------------------
function stop () {
  if (speaker) {
    speaker.end();
  }
}
// -----------------------------------------------------------------------------
/** Play youtube video by youtube id.
* @method playSong
* @param {String} youtubeId - Youtube video id.
*/
// -----------------------------------------------------------------------------
function playSong (youtubeId) {
  // Get download stream
  var dl = ytdl(buildYoutubeUrl(youtubeId), {
    filter: function (format) { return format.container === 'mp4'; }
  });
  console.log('playing song - ' + youtubeId);
  // Format and pipe to speakers.
  ffmpeg(dl)
    .format('mp3')
    .pipe(new lame.Decoder())
    .on('format', function (format) {
      // if (speaker) speaker.end();
      speaker = new Speaker(format);
      this.pipe(speaker);
      userInputFlag = false;

      speaker.on('close', function () {
        if(!userInputFlag){
          getRelatedYoutubeId(youtubeId, function(error, relatedYtId){
            if(relatedYtId){
              ytId = relatedYtId
              playSong(ytId)
            }

          })
        }
      })
    });
}

function searchSong (query, next) {
  delete youTube['params']['relatedToVideoId']
  youTube.search(query, 10, function(error, results) {
    if (error) {
      console.log(error);
    } else {
      var songObject = _.find(results['items'], function(result){
         return _.get(result, 'id.kind') === "youtube#video"
      });
      var id = _.get(songObject, 'id.videoId')
      return next(null, id);
    }
  });
}


function next () {
  getRelatedYoutubeId(ytId, function(error, relatedYtId){
    if(relatedYtId){
      if (speaker) {
        speaker.end();
      }
      ytId = relatedYtId;
      playSong(ytId)
    }
  })
}


// -----------------------------------------------------------------------------
/** Get a youtube video's related items.
* @method getRelatedYoutubeId
* @param {String} youtubeId - Youtube video id.
* @param {Function} next - callback function.
*/
// -----------------------------------------------------------------------------
function getRelatedYoutubeId (youtubeId, next) {
  youTube.related(youtubeId, 1, function (error, result) {
    if (error) {
      console.log(error);
      next(error);
    } else {
      next(null, _.get(result.items[0], 'id.videoId'));
    }
  });
}
// -----------------------------------------------------------------------------
/** Create youtube url from video id.
* @method buildYoutubeUrl
* @param {String} youtubeId - Youtube video id.
*/
// -----------------------------------------------------------------------------
function buildYoutubeUrl (youtubeId) {
  return ytBaseUrl + youtubeId;
}
/**
* Jukebox API.
* @module Api/Jukebox
*/
module.exports = {
  init: init,
  resolve: resolve
};
