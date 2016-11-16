var environment = process.env.NODE_ENV || "local";

switch (environment) {
    case 'local':
    case 'development':
    case 'staging':
    case 'live':
        threadId = process.env.THREAD_ID;
        username = process.env.USERNAME;
        password = process.env.PASSWORD;
        nickname = process.env.NICKNAME || 'Butler';
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
