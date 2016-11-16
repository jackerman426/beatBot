var environment = process.env.NODE_ENV || "local";

switch (environment) {
    case 'local':
    case 'development':
    case 'staging':
    case 'live':
        apiKey = process.env.YOUTUBE_API_KEY;
        break;
    default:
        throw new Error("Unhandled environment!");
}

module.exports = {
    apiKey: apiKey
};
