require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/checkWallet');
const checkPracticeMode = require('./utils/practiceStore');

// Init bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;

console.log('✅ SheepTrackerBot is running...');
console.log('Wallet:', process.env.WALLET_ADDRESS);
console.log('API Key:', process.env.BIRDEYE_API_KEY);

// 🛠️ /ping test
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong');
});

// 🎮 /start practice mode
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'start');
  bot.sendMessage(msg.chat.id, result);
});

// 💰 /buy
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'buy', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🏷️ /sell
bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'sell', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧾 /balance
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// 🔁 Wallet tracker runs every 20 seconds
setInterval(() => {
  checkWallet(bot, groupId, process.env.WALLET_ADDRESS, process.env.BIRDEYE_API_KEY);
}, 20000);
