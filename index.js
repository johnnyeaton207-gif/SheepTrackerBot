require('dotenv').config();
const { Telegraf } = require('telegraf');
const config = require('./config');
const sniper = require('./modules/sniper');
const simauto = require('./modules/simauto');
const practice = require('./modules/practice');
const walletTracker = require('./modules/walletTracker');
const zombieScanner = require('./modules/zombieScanner');

const bot = new Telegraf(process.env.BOT_TOKEN);

// === Group ID Logger ===
bot.on('message', (ctx) => {
  const chatId = ctx.chat.id;
  console.log(`Incoming message from chat ID: ${chatId}`);
});

// === Command: Mode Switching ===
bot.command('mode', (ctx) => {
  const args = ctx.message.text.split(' ');
  const mode = args[1]?.toLowerCase();
  switch (mode) {
    case 'live':
      config.mode = 'live';
      ctx.reply('🔴 Sniper mode: LIVE');
      break;
    case 'simauto':
      config.mode = 'simauto';
      ctx.reply('🧪 Sniper mode: SimAuto (test only)');
      break;
    case 'practice':
      config.mode = 'practice';
      ctx.reply('🎯 Sniper mode: Manual Practice');
      break;
    default:
      ctx.reply('Usage: /mode [live | simauto | practice]');
  }
});

// === Main Polling Logic ===
setInterval(() => {
  if (config.mode === 'live') {
    sniper.run(bot);
  } else if (config.mode === 'simauto') {
    simauto.run(bot);
  } else if (config.mode === 'practice') {
    // Manual only
  }
  walletTracker.run(bot);
  zombieScanner.run(bot);
}, config.pollInterval || 15000);

// === Bot Launch ===
bot.launch();
console.log('🐺 SheepTrackerBot is running...');
