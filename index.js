require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { addBuy, getBuys, clearBuys } = require('./utils/practiceStore');

// Start the bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log('✅ SheepTrackerBot is running...');

// Log any chat ID on message
bot.on('message', (msg) => {
  try {
    const chatId = msg.chat.id;
    console.log('📟 Chat ID:', chatId);

    // Optional ping check
    if (msg.text && msg.text.toLowerCase().includes('ping')) {
      bot.sendMessage(chatId, 'Pong 🐑');
    }
  } catch (err) {
    console.error('❌ Error handling message:', err);
  }
});

// Handle /practice buy <token_address> <amount>
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
