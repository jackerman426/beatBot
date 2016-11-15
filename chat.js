var api = null;

function hi (message) {
  api.markAsRead(message.threadID, function (err) {
    if (err) console.log(err);
  });
  api.sendMessage(message.body.split(' ')[2], message.threadID);
}

module.exports = {
  hi: hi,
  resolve: function (message) {
    hi(message);
  },
  init: function (fbAPI) {
    api = fbAPI;
  }
};
