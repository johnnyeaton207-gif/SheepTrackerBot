require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/walletTracker');
const practiceStore = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log('✅ SheepTrackerBot is running...');

// 🧠 Practice Mode Commands
bot.onText(/\/practice (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];
  let response = practiceStore.handleInput(input);
  bot.sendMessage(chatId, response);
});

bot.onText(/\/practice$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, practiceStore.getState());
});

bot.onText(/\/practice clear/, (msg) => {
  const chatId = msg.chat.id;
  practiceStore.clear();
  bot.sendMessage(chatId, '🧹 Practice store cleared.');
});

// 👀 Wallet Tracker Loop
setInterval(() => {
  if (process.env.GROUP_ID) {
    checkWallet(bot, process.env.GROUP_ID);
  }
}, 15000);
