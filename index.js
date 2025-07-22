require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/walletTracker');
const checkPracticeMode = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;
const wallet = process.env.WALLET_ADDRESS;
const apiKey = process.env.BIRDEYE_API_KEY;

console.log("✅ SheepTrackerBot is running...");
console.log("Wallet:", wallet);
console.log("API Key:", apiKey);

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

// 🧪 Check Balance
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// ⏱️ Run Wallet Tracker every 20 seconds
setInterval(() => {
  checkWallet(bot, groupId, wallet, apiKey);
}, 20000);
