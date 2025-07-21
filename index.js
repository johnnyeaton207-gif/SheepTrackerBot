
 require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Create the bot using your token
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Log when bot starts
console.log('SheepTrackerBot is running...');

// Log the group or chat ID when any message is received
bot.on('message', (msg) => {
  console.log('Chat ID:', msg.chat.id);

  // Optional: have bot reply to confirm it's active
  if (msg.text && msg.text.toLowerCase() === 'ping') {
    bot.sendMessage(msg.chat.id, 'Pong 🐑');
  }
});
