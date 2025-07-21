const config = require('../config');

module.exports = {
  run: async (bot) => {
    if (!config.enableZombieScanner) return;

    // Simulated detection of a zombie pump
    const token = {
      name: 'ZOMBUCKS',
      symbol: '$ZMB',
      ageDays: 34,
      oldVolume: 100,
      newVolume: 2600,
      priceJump: 3.1,
    };

    if (token.newVolume > token.oldVolume * 10 && token.priceJump > 2.5) {
      console.log(`🧟‍♂️ Zombie token detected: ${token.symbol} — +${token.priceJump.toFixed(2)}x pump`);

      bot.telegram.sendMessage(
        process.env.GROUP_ID || process.env.BOT_OWNER,
        `🧟‍♂️ Zombie Token Alert: ${token.symbol}\nAge: ${token.ageDays} days\nPump: ${token.priceJump.toFixed(2)}x\nVolume Surge: ${token.newVolume}`
      );
    }
  },
};
