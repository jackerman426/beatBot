var login = require("facebook-chat-api");
var getYouTubeID = require('get-youtube-id');

var THREAD_ID = process.env.THREAD_ID;
var USERNAME = process.env.USERNAME;
var PASSWORD = process.env.PASSWORD;

var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var lame = require('lame');
var Speaker = require('speaker');

//PLAYS A YOUTUBE SONG FROM FB CHAT
login({email: USERNAME, password: PASSWORD}, function callback (err, api) {
    if(err) return console.error(err);
    var speaker = null;
    api.listen(function callback(err, message) {
        if(message.threadID == THREAD_ID){
            var id = getYouTubeID(message.body);
            if(id){
                var dl = ytdl(message.body, {
                    filter: function(format) { return format.container === 'mp4'; }
                });
                var converter = ffmpeg(dl).format('mp3').pipe(new lame.Decoder())
                    .on('format', function (format) {
                        if(speaker) {
                            speaker.end();
                        }
                        speaker = new Speaker(format)
                        this.pipe(speaker);
                        console.log('Playing youtube song with id: - ' + id)
                    });
            }

        }
    });
});