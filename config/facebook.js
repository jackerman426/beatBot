var environment = process.env.NODE_ENV || "local";

switch (environment) {
    case 'local':
    case 'development':
    case 'staging':
    case 'live':
        threadId = process.env.FB_THREAD_ID;
        username = process.env.FB_USERNAME;
        password = process.env.FB_PASSWORD;
        pageToken = process.env.PAGE_TOKEN || '';
        verifyToken = process.env.VERIFY_TOKEN || '';
        appSecret = process.env.APP_SECRET || '';
        nickname = process.env.BOT_NICKNAME || 'BeatBot';
        break;
    default:
        throw new Error("Unhandled environment!");
}

module.exports = {
    threadId: threadId,
    username: username,
    password: password,
    pageToken: pageToken,
    verifyToken: verifyToken,
    appSecret: appSecret,
    nickname: nickname
};