const fs = require('fs');
const async = require('async');
const mkdirp = require('mkdirp');

const env = process.env.NODE_ENV || 'local';
const envPath = './env/';
const envFile = env + '.env';
// Load environment
const envFilePathName = envPath + envFile;

async.waterfall([

    function (callback) {

        //create env file if doesnt exist
        fs.open(envFilePathName, 'r', function (err, fd) {
            if (err) {
                mkdirp(envPath, function (err) {
                    if (err)
                        return callback(err);

                    fs.writeFile(envFilePathName, '', function(err){
                        if (err)
                            return callback(err);
                        return callback('An env file has been created in env folder. Please specify you env variables and run again');
                    });

                });
            } else {
                return callback(null);
            }
        });
    },
    function (callback) {

        require('dotenv').config({path: envFilePathName});

        const Bot = require('./components/bot/bot');
        const bot = new Bot();
        // Start Server
        bot.start();
    }

], function (error) {
    console.error(error);
    process.exit()
});



