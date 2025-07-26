require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const { checkWallet } = require('./utils/checkWallet');
const { buyToken } = require('./utils/buyHandler');
const { sellToken } = require('./utils/sellHandler');
const { checkPracticeMode, setPracticeMode } = require('./utils/practiceHandler');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const BUY_WALLET = process.env.BUY_WALLET;
const SELL_WALLET = process.env.SELL_WALLET;
const GROUP_ID = process.env.GROUP_ID;
const PRACTICE_WALLET = process.env.PRACTICE_WALLET;

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const isPractice = await checkPracticeMode(userId);
  const walletToCheck = isPractice ? PRACTICE_WALLET : null;

  if (walletToCheck) {
    await checkWallet(userId, walletToCheck, bot);
  }

  bot.sendMessage(chatId, `🐺 Welcome to SheepTrackerBot\!\nUse the buttons to BUY or SELL tokens\.`);
});

bot.onText(/\/setwallet (.+)/, (msg, match) => {
  const userId = msg.from.id;
  const wallet = match[1];
  const walletsPath = path.join(__dirname, 'data', 'user_wallets.json');
  const wallets = fs.existsSync(walletsPath) ? JSON.parse(fs.readFileSync(walletsPath)) : {};
  wallets[userId] = wallet;
  fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 2));
  bot.sendMessage(msg.chat.id, `✅ Wallet set to: \`${wallet}\``, { parse_mode: 'Markdown' });
});

bot.onText(/\/mywallet/, (msg) => {
  const userId = msg.from.id;
  const walletsPath = path.join(__dirname, 'data', 'user_wallets.json');
  const wallets = fs.existsSync(walletsPath) ? JSON.parse(fs.readFileSync(walletsPath)) : {};
  const wallet = wallets[userId];
  if (wallet) {
    checkWallet(userId, wallet, bot);
  } else {
    bot.sendMessage(msg.chat.id, '⚠️ Wallet not set. Use /setwallet <your_wallet_address>');
  }
});

bot.onText(/\/buy (\S+)(?: (\d*\.?\d+))?/, async (msg, match) => {
  const userId = msg.from.id;
  const tokenSymbol = match[1];
  const amount = match[2] || '0.1';
  await buyToken(userId, tokenSymbol, amount, bot);
});

bot.onText(/\/sell (\S+)(?: (\d*\.?\d+))?/, async (msg, match) => {
  const userId = msg.from.id;
  const tokenSymbol = match[1];
  const amount = match[2] || '0.1';
  await sellToken(userId, tokenSymbol, amount, bot);
});

bot.onText(/\/practice/, async (msg) => {
  const userId = msg.from.id;
  const active = await checkPracticeMode(userId);
  const newState = !active;
  await setPracticeMode(userId, newState);
  bot.sendMessage(msg.chat.id, `🧪 Practice mode is now *${newState ? 'ON' : 'OFF'}*`, { parse_mode: 'Markdown' });
});

console.log('✅ SheepTrackerBot is running...');
