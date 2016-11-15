var YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
var getYouTubeID = require('get-youtube-id');
var YouTube = require('youtube-node');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var lame = require('lame');
var Speaker = require('speaker');
global['_'] = require('lodash');
var _ = global['_'];
var api = null;

var youTube = new YouTube();
youTube.setKey(YOUTUBE_API_KEY);
var speaker = null;

function playSong (youtubeId) {
  // Get download stream
  var dl = ytdl(buildYoutubeUrl(youtubeId), {
    filter: function (format) { return format.container === 'mp4'; }
  });
  // Format and pipe to speakers.
  ffmpeg(dl)
    .format('mp3')
    .pipe(new lame.Decoder())
    .on('format', function (format) {
      if (speaker) speaker.end();
      speaker = new Speaker(format);
      this.pipe(speaker);
    });
}

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

function buildYoutubeUrl (youtubeId) {
  return 'https://www.youtube.com/watch?v=' + youtubeId;
}

function play (message) {
  var id = getYouTubeID(message.body);
  if (id) playSong(id);
}
module.exports = {
  playSong: playSong,
  buildYoutubeUrl: buildYoutubeUrl,
  getRelatedYoutubeId: getRelatedYoutubeId,
  play: play,
  init: function (fbAPI) {
    api = fbAPI;
  }
};
