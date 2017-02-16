var environment = process.env.NODE_ENV || "local";

switch (environment) {
    case 'local':
    case 'development':
    case 'staging':
    case 'live':
        threadId = process.env.FB_THREAD_ID;
        username = process.env.FB_USERNAME;
        password = process.env.FB_PASSWORD;
        nickname = process.env.BOT_NICKNAME || 'Bot';
        break;
    default:
        throw new Error("Unhandled environment!");
}

module.exports = {
    threadId: threadId,
    username: username,
    password: password,
    nickname: nickname
};