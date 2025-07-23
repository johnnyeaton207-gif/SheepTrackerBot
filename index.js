require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/walletTracker');
const practiceStore = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;

console.log("✅ SheepTrackerBot is running...");
console.log("Wallet:", process.env.WALLET_ADDRESS);
console.log("API Key:", process.env.BIRDEYE_API_KEY);

// 🔁 Ping
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong 🐑');
});

// 🧪 Start Practice Mode
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await practiceStore(userId, 'start');
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Balance Check
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await practiceStore(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Buy — format: /buy SYMBOL AMOUNT
bot.onText(/\/buy (\w+)\s+([\d.]+)/, async (msg, match) => {
  const userId = msg.from.id;
  const symbol = match[1];
  const amount = match[2];
  const result = await practiceStore(userId, 'buy', symbol, amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Sell — format: /sell SYMBOL AMOUNT
bot.onText(/\/sell (\w+)\s+([\d.]+)/, async (msg, match) => {
  const userId = msg.from.id;
  const symbol = match[1];
  const amount = match[2];
  const result = await practiceStore(userId, 'sell', symbol, amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🔎 Wallet Tracking (every 20s)
setInterval(() => {
  checkWallet(bot, groupId, process.env.WALLET_ADDRESS, process.env.BIRDEYE_API_KEY);
}, 20000);
