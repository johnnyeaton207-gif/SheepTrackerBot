const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./checkWallet');

// Replace with your actual bot token and group ID
const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const GROUP_ID = 'YOUR_GROUP_ID'; // example: -1001234567890
const WALLET_ADDRESS = 'X7sRZF4yodAZCDLnAb3aKA94BZwXX1wxuWEGnGyU4Gz';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Respond to /start or /check
bot.onText(/\/start|\/check/, async (msg) => {
  const chatId = msg.chat.id;

  if (String(chatId) !== String(GROUP_ID)) {
    return bot.sendMessage(chatId, "❌ Unauthorized group");
  }

  bot.sendMessage(chatId, '🔍 Checking wallet...');
  await checkWallet(bot, chatId, WALLET_ADDRESS);
});

// Optional: Ping confirmation
bot.on('message', (msg) => {
  if (msg.text.toLowerCase() === 'ping') {
    bot.sendMessage(msg.chat.id, 'pong 🐺');
  }
});
