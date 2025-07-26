require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/checkWallet');
const checkPracticeMode = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("✅ SheepTrackerBot is running...");

// 🔁 Ping Test
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong');
});

// 🧪 Practice Mode Buy
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'buy', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Practice Mode Sell
bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'sell', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Start Practice
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'start');
  bot.sendMessage(msg.chat.id, result);
});

// 💼 Balance Check
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// 💾 Save wallet address
bot.onText(/\/setwallet (.+)/, (msg, match) => {
  const userId = msg.from.id;
  const address = match[1].trim();
  if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(address)) {
    return bot.sendMessage(userId, "⚠️ Invalid wallet address format.");
  }
  checkWallet.saveUserWallet(userId, address);
  bot.sendMessage(userId, `✅ Wallet saved: \`${address}\``, { parse_mode: 'Markdown' });
});

// 📥 Check saved wallet privately
bot.onText(/\/mywallet/, async (msg) => {
  const userId = msg.from.id;
  await checkWallet(bot, userId, null, false);
});
