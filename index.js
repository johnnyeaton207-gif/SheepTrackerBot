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

