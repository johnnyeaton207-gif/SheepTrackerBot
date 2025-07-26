require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/checkWallet');
const checkPracticeMode = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;

console.log("✅ SheepTrackerBot is running...");
console.log("Wallet:", process.env.WALLET_ADDRESS);
console.log("API Key:", process.env.BIRDEYE_API_KEY);
console.log("RPC URL:", process.env.SOLANA_RPC);

// 🏓 Ping
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong');
});

// 🧪 Practice Mode: Start
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'start');
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Practice Buy
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'buy', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Practice Sell
bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'sell', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Practice Balance
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// 🔍 Manual Wallet Check: /checkwallet <wallet>
bot.onText(/\/checkwallet (.+)/, async (msg, match) => {
  const wallet = match[1];
  await checkWallet(bot, msg.chat.id, wallet, process.env.BIRDEYE_API_KEY, process.env.SOLANA_RPC, false);
});

// 🔁 Background Wallet Check (your wallet only, silent mode)
setInterval(() => {
  checkWallet(bot, groupId, process.env.WALLET_ADDRESS, process.env.BIRDEYE_API_KEY, process.env.SOLANA_RPC, true);
}, 20000);
