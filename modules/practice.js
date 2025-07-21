module.exports = {
  run: async (bot) => {
    bot.command('practicebuy', (ctx) => {
      const fakeToken = {
        name: 'PEPEZILLA',
        symbol: '$PZL',
        entry: 0.002,
        exit: 0.0051,
      };

      const gain = fakeToken.exit / fakeToken.entry;

      ctx.reply(`🎯 Practice trade executed on ${fakeToken.symbol}\nSimulated gain: ${gain.toFixed(2)}x`);
    });
  },
};
