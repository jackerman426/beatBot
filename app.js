// var login = require("facebook-chat-api");
// var getYouTubeID = require('get-youtube-id');
// var YouTube = require('youtube-node');
// var ytdl = require('ytdl-core');
// var ffmpeg = require('fluent-ffmpeg');
// var lame = require('lame');
// var Speaker = require('speaker');
var async = require('async');
var login = require("facebook-chat-api");

var BBFacebookChat = require('./components/facebook/BBFacebookChat');
var BBYoutube = require('./components/youtube/BBYoutube');

var facebookChat = new BBFacebookChat();
var youtube = new BBYoutube();

var facebookConfig = require('./config/facebook');
var youtubeConfig = require('./config/youtube');


// var youTube = new YouTube();


global['_'] = require('lodash');

async.auto({

    login_to_facebook: function(callback){

        facebookChat.login(facebookConfig.username, facebookConfig.password, function(error){
            return callback(error)
        });
    },

    initialize_youtube: function(callback){

        youtube.initialize(youtubeConfig.apiKey, function(error){
            return callback(error);
        })
    }


}, function(error){
    // if(error)
        process.exit()
});


// var youTube = new YouTube();
// youTube.setKey(YOUTUBE_API_KEY);

// var speaker = null;

//PLAYS A YOUTUBE SONG FROM FB CHAT
// login({email: facebookConfig.username, password: facebookConfig.password}, function callback (err, api) {
//     if(err) return console.error(err);
//
//     api.listen(function callback(err, message) {
//         if(message.threadID == THREAD_ID){
//             var id = getYouTubeID(message.body);
//             if(id){
//                 playSong(id);
//             }
//
//         }
//     });
// });
//
// function playSong(youtubeId){
//     var dl = ytdl(buildYoutubeUrl(youtubeId), {
//         filter: function(format) { return format.container === 'mp4'; }
//     });
//     var converter = ffmpeg(dl).format('mp3').pipe(new lame.Decoder())
//       .on('format', function (format) {
//           if(speaker) {
//               speaker.end()
//           }
//           speaker = new Speaker(format);
//           this.pipe(speaker);
//           console.log('Playing youtube song with id: - ' + youtubeId);
//
//           speaker.on('flush', function(){
//               getRelatedYoutubeId(youtubeId, function(error, relatedId){
//                   playSong(relatedId, false)
//               })
//           });
//       });
// }
//
// function buildYoutubeUrl(youtubeId) {
//     return "https://www.youtube.com/watch?v=" + youtubeId;
// }
//
// function getRelatedYoutubeId(youtubeId, next) {
//     youTube.related(youtubeId, 1, function(error, result) {
//         if (error) {
//             console.log(error);
//             next(error);
//         }
//         else {
//             next(null, _.get(result.items[0], 'id.videoId'));
//         }
//     });
// }