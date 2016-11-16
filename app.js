// Load environment
var env = process.env.NODE_ENV || 'local';
var envFile = env + '.env';
require('dotenv').config({path: './env/' + envFile});
// Start Bot
require('./components/bot').start();
