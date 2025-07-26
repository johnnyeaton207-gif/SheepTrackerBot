require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/checkWallet');
const checkPracticeMode = require('./utils/practiceStore');
const fs = require('fs');
const path = require('path');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const walletPath = path.join(__dirname, './data/user_wallets.json');
if (!fs.existsSync(walletPath)) fs.writeFileSync(walletPath, JSON.stringify({}));
const userWallets = JSON.parse(fs.readFileSync(walletPath));

function saveWallets() {
  fs.writeFileSync(walletPath, JSON.stringify(userWallets, null, 2));
}

console.log("✅ SheepTrackerBot is running...");

// /ping test
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong 🐑');
});

// 🧪 Start practice mode
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'start');
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Buy command
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'buy', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Sell command
bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'sell', amount);
  bot.sendMessage(msg.chat.id, result);
});

// 🧪 Balance check
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// Set user wallet
bot.onText(/\/setwallet (.+)/, (msg, match) => {
  const userId = msg.from.id;
  const wallet = match[1];
  userWallets[userId] = wallet;
  saveWallets();
  bot.sendMessage(msg.chat.id, `✅ Wallet saved for your account.\n\n🔗 ${wallet}`, { reply_to_message_id: msg.message_id });
});

// Check user's saved wallet balance (private)
bot.onText(/\/mywallet/, async (msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const wallet = userWallets[userId];

  if (!wallet) {
    return bot.sendMessage(chatId, `⚠️ No wallet found. Use /setwallet <address> first.`, { reply_to_message_id: msg.message_id });
  }

  try {
    const response = await checkWallet(bot, chatId, wallet, process.env.BIRDEYE_API_KEY, true);
    bot.sendMessage(userId, response); // DM user only
  } catch (err) {
    bot.sendMessage(userId, `❌ Error checking your wallet.`);
    console.error(err);
  }
});
