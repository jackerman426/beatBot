var login = require("facebook-chat-api");
var getYouTubeID = require('get-youtube-id');
var YouTube = require('youtube-node');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var lame = require('lame');
var Speaker = require('speaker');
global['_'] = require('lodash');

var THREAD_ID = process.env.THREAD_ID;
var USERNAME = process.env.USERNAME;
var PASSWORD = process.env.PASSWORD;
var YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;



var youTube = new YouTube();
youTube.setKey(YOUTUBE_API_KEY);

var speaker = null;

//PLAYS A YOUTUBE SONG FROM FB CHAT
login({email: USERNAME, password: PASSWORD}, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message) {
        if(message.threadID == THREAD_ID){
            var id = getYouTubeID(message.body);
            if(id){
                playSong(id);
            }

        }
    });
});

function playSong(youtubeId){
    var dl = ytdl(buildYoutubeUrl(youtubeId), {
        filter: function(format) { return format.container === 'mp4'; }
    });
    var converter = ffmpeg(dl).format('mp3').pipe(new lame.Decoder())
      .on('format', function (format) {
          if(speaker) {
              speaker.end()
          }
          speaker = new Speaker(format);
          this.pipe(speaker);
          console.log('Playing youtube song with id: - ' + youtubeId);

          speaker.on('flush', function(){
              getRelatedYoutubeId(youtubeId, function(error, relatedId){
                  playSong(relatedId, false)
              })
          });
      });
}

function buildYoutubeUrl(youtubeId) {
    return "https://www.youtube.com/watch?v=" + youtubeId;
}

function getRelatedYoutubeId(youtubeId, next) {
    youTube.related(youtubeId, 1, function(error, result) {
        if (error) {
            console.log(error);
            next(error);
        }
        else {
            next(null, _.get(result.items[0], 'id.videoId'));
        }
    });
}