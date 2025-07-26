require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const checkWallet = require('./utils/checkWallet');
const checkPracticeMode = require('./utils/practiceStore');
const { formatSOLBalance, formatSPLHoldings } = require('./utils/formatting');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;
const WELCOME_MSG = `🚀 *Welcome to SheepTrackerBot!*

/start - Begin Practice Mode
/buy [amount] - Buy in Practice Mode
/sell [amount] - Sell in Practice Mode
/balance - Check Practice Balance
/setwallet [wallet] - Track Your Wallet
/mywallet - See Your Live Wallet Holdings (Private)`;

console.log("✅ SheepTrackerBot is running...");

// Command: /ping
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong');
});

// Command: /start
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'start');
  bot.sendMessage(msg.chat.id, result, { parse_mode: 'Markdown' });
});

// Command: /buy
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'buy', amount);
  bot.sendMessage(msg.chat.id, result);
});

// Command: /sell
bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'sell', amount);
  bot.sendMessage(msg.chat.id, result);
});

// Command: /balance
bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// Command: /setwallet <address>
bot.onText(/\/setwallet (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const wallet = match[1];
  const walletsPath = path.join(__dirname, 'data', 'user_wallets.json');
  let wallets = {};

  if (fs.existsSync(walletsPath)) {
    wallets = JSON.parse(fs.readFileSync(walletsPath));
  }

  wallets[userId] = wallet;
  fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 2));

  bot.sendMessage(msg.chat.id, `✅ Wallet set for <b>${msg.from.first_name}</b>: \`${wallet}\``, { parse_mode: 'HTML' });
});

// Command: /mywallet (PRIVATE RESPONSE)
bot.onText(/\/mywallet/, async (msg) => {
  const userId = msg.from.id;
  const walletsPath = path.join(__dirname, 'data', 'user_wallets.json');
  let wallets = {};

  if (fs.existsSync(walletsPath)) {
    wallets = JSON.parse(fs.readFileSync(walletsPath));
  }

  const userWallet = wallets[userId];

  if (!userWallet) {
    return bot.sendMessage(userId, '❌ No wallet set. Use /setwallet <your_wallet_address> first.');
  }

  const result = await checkWallet(null, null, userWallet, process.env.BIRDEYE_API_KEY);
  bot.sendMessage(userId, result, { parse_mode: 'Markdown' });
});

// Startup broadcast
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, WELCOME_MSG, { parse_mode: 'Markdown' });
});

module.exports = bot;
