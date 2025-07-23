require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/walletTracker');
const {
  startPractice,
  mockBuy,
  mockSell,
  checkBalance,
  resetPractice
} = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;
const wallet = process.env.WALLET_ADDRESS;
const apiKey = process.env.BIRDEYE_API_KEY;

console.log("✅ SheepTrackerBot is running...");
console.log("Wallet:", wallet);
console.log("API Key:", apiKey);

// 🐺 Ping test
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, '🐺 Pong! Tracker online.');
});

// 🧠 Start Practice Mode
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await startPractice(userId);
  bot.sendMessage(msg.chat.id, result);
});

// 💸 Mock Buy
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await mockBuy(userId, parseFloat(amount));
  bot.sendMessage(msg.chat.id, result);
});

// 💰 Mock Sell
bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await mockSell(userId, parseFloat(amount));
  bot.sendMessage(msg.chat.id, result);
});

// 📊 Check Balance
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkBalance(userId);
  bot.sendMessage(msg.chat.id, result);
});

// 🔁 Reset Practice Account
bot.onText(/\/reset/, async (msg) => {
  const userId = msg.from.id;
  const result = await resetPractice(userId);
  bot.sendMessage(msg.chat.id, result);
});

// 👀 Check Wallet Tokens
bot.onText(/\/wallet/, async (msg) => {
  const result = await checkWallet(wallet, apiKey);
  bot.sendMessage(msg.chat.id, result);
});

// 🔄 Auto Wallet Tracker every 20s
setInterval(async () => {
  const result = await checkWallet(wallet, apiKey);
  if (result) bot.sendMessage(groupId, result);
}, 20000);
