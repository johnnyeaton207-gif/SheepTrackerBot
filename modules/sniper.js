const config = require('../config');

module.exports = {
  run: async (bot) => {
    // Simulate a launch detection (replace with real Birdeye/RugCheck integration later)
    const newToken = {
      name: 'DEGEN',
      symbol: '$DGN',
      launchPrice: 0.002,
      currentPrice: 0.0042,
      isRugFree: true,
    };

    const gain = newToken.currentPrice / newToken.launchPrice;

    if (!newToken.isRugFree) {
      console.log(`🚫 ${newToken.symbol} failed RugCheck`);
      return;
    }

    if (gain >= config.tpMultiplier) {
      console.log(`✅ TP HIT on ${newToken.symbol} at ${gain.toFixed(2)}x`);
      bot.telegram.sendMessage(
        process.env.GROUP_ID || process.env.BOT_OWNER,
        `💰 TP HIT on ${newToken.symbol} — +${gain.toFixed(2)}x\n(Simulated Real Mode)`
      );
    } else if (gain < 1 - config.slThreshold) {
      console.log(`❌ SL HIT on ${newToken.symbol} at ${gain.toFixed(2)}x`);
      bot.telegram.sendMessage(
        process.env.GROUP_ID || process.env.BOT_OWNER,
        `🛑 SL HIT on ${newToken.symbol} — ${gain.toFixed(2)}x\n(Simulated Real Mode)`
      );
