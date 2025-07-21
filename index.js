const { addBuy, getBuys, clearBuys } = require('./utils/practiceStore');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Create a new bot instance using your token from the .env file
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Log that the bot is running
console.log('✅ SheepTrackerBot is running...');

// Listen for all messages
bot.on('message', (msg) => {
  try {
    const chatId = msg.chat.id;
    console.log('📟 Chat ID:', chatId);

    // Optional: Reply if someone types "ping"
    if (msg.text && msg.text.toLowerCase().includes('ping')) {
      bot.sendMessage(chatId, 'Pong 🐑');
    }

  } catch (error) {
    console.error('❌ Error handling message:', error.message);
  }
});
bot.onText(/\/practice buy (.+) (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const token = match[1];
  const amount = parseFloat(match[2]);

  if (!token || isNaN(amount)) {
    return bot.sendMessage(chatId, '❌ Invalid format. Use:\n/practice buy <token_address> <amount>');
  }

  addBuy(userId, token, amount);
  bot.sendMessage(chatId, `✅ Practice buy recorded:\nToken: ${token}\nAmount: ${amount} SOL`);
});

