var environment = process.env.NODE_ENV || "local";

switch (environment) {
    case 'local':
    case 'development':
    case 'staging':
    case 'live':
        break;
    default:
        throw new Error("Unhandled environment!");
}

module.exports = {
    VERSION_NUMBER: "0.0.1",
    ENVIRONMENT : environment,
    EMAIL_ADDRESS: ['mtzakris@gmail.com', ''],
    NAME: 'BeatBot'
};
