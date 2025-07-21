module.exports = {
  log: (msg) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${msg}`);
  },

  notify: (bot, message) => {
    const target = process.env.GROUP_ID || process.env.BOT_OWNER;
    if (bot && target) {
      bot.telegram.sendMessage(target, message);
    }
  },
};
