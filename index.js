require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { addBuy, getBuys, clearBuys } = require('./utils/practiceStore');
const checkWallet = require('./utils/walletTracker');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log('✅ SheepTrackerBot is running...');

// 📟 Log chat ID and respond to ping
bot.on('message', (msg) => {
  try {
    const chatId = msg.chat.id;
    console.log('📟 Chat ID:', chatId);

    if (msg.text && msg.text.toLowerCase().includes('ping')) {
      bot.sendMessage(chatId, 'Pong 🐑');
    }
  } catch (err) {
    console.error('❌ Error handling message:', err);
  }
});

// 🧪 Practice Buy Command
bot.onText(/\/practice buy (.+) (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const token = match[1];
  const amount = parseFloat(match[2]);

  if (!token || isNaN(amount)) {
    return bot.sendMessage(chatId, '❌ Invalid format. Use:\n/practice buy <token_address> <amount>');
  }

  addBuy(userId, token, amount);
  bot.sendMessage(chatId, `✅ Practice buy recorded:\nToken: ${token}\nAmount: ${amount} SOL`);
});

// 📊 Practice View Command
bot.onText(/\/practice view/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const buys = getBuys(userId);

  if (!buys.length) {
    return bot.sendMessage(chatId, '📭 No practice trades found.');
  }

  const summary = buys.map((buy) => {
    const minsAgo = Math.floor((Date.now() - buy.timestamp) / 60000);
    return `• ${buy.token} — ${buy.amount} SOL — ${minsAgo} min(s) ago`;
  }).join('\n');

  bot.sendMessage(chatId, `📊 Practice Trades:\n${summary}`);
});

// 🔁 Check wallet every 60 seconds for new buys
setInterval(() => {
  checkWallet(bot, process.env.GROUP_ID);
}, 60000);
