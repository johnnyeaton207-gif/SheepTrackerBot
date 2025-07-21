const config = require('../config');

module.exports = {
  run: async (bot) => {
    const fakeToken = {
      name: 'WAGMI',
      symbol: '$WAG',
      launchPrice: 0.001,
      currentPrice: 0.0027,
      isRugFree: true,
    };

    const gain = fakeToken.currentPrice / fakeToken.launchPrice;

    if (!fakeToken.isRugFree) {
      console.log(`🚫 ${fakeToken.symbol} failed RugCheck`);
      return;
    }

    if (gain >= config.tpMultiplier) {
      console.log(`🧪 Sim TP HIT on ${fakeToken.symbol} at ${gain.toFixed(2)}x`);
      if (config.simLogResults) {
        bot.telegram.sendMessage(
          process.env.GROUP_ID || process.env.BOT_OWNER,
          `🧪 Sim TP HIT: ${fakeToken.symbol} — +${gain.toFixed(2)}x`
        );
      }
    } else if (gain < 1 - config.slThreshold) {
      console.log(`🧪 Sim SL HIT on ${fakeToken.symbol} at ${gain.toFixed(2)}x`);
      if (config.simLogResults) {
        bot.telegram.sendMessage(
          process.env.GROUP_ID || process.env.BOT_OWNER,
          `🧪 Sim SL HIT: ${fakeToken.symbol} — ${gain.toFixed(2)}x`
        );
      }
    } else {
      if (!config.showOnlyProfitableSim) {
        bot.telegram.sendMessage(
          process.env.GROUP_ID || process.env.BOT_OWNER,
          `🧪 Sim Update: ${fakeToken.symbol} — ${gain.toFixed(2)}x`
        );
      }
    }
  },
};
