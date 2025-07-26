require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/checkWallet');
const checkPracticeMode = require('./utils/practiceStore');
const sendSOL = require('./modules/trade');
const fs = require('fs');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("✅ SheepTrackerBot is running...");

// 🔁 Ping
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong');
});

// 🧪 Practice Mode
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'start');
  bot.sendMessage(msg.chat.id, result);
});

bot.onText(/\/buy (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'buy', amount);
  bot.sendMessage(msg.chat.id, result);
});

bot.onText(/\/sell (.+)/, async (msg, match) => {
  const userId = msg.from.id;
  const amount = match[1];
  const result = await checkPracticeMode(userId, 'sell', amount);
  bot.sendMessage(msg.chat.id, result);
});

bot.onText(/\/balance/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkPracticeMode(userId, 'balance');
  bot.sendMessage(msg.chat.id, result);
});

// 🪙 Real Buy Menu
bot.onText(/\/buyreal/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Buy 0.05 SOL', callback_data: 'buy_0.05' },
          { text: 'Buy 0.1 SOL', callback_data: 'buy_0.1' }
        ],
        [
          { text: 'Custom Amount', callback_data: 'buy_custom' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, '💸 Choose your SOL buy amount:', options);
});

// Handle Buy Buttons
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('buy_')) {
    if (data === 'buy_custom') {
      bot.sendMessage(chatId, '✏️ Enter the custom SOL amount to send (e.g., `0.07`):', {
        reply_markup: { force_reply: true }
      }).then((sentMsg) => {
        bot.onReplyToMessage(sentMsg.chat.id, sentMsg.message_id, async (reply) => {
          const amount = parseFloat(reply.text);
          if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(chatId, '❌ Invalid amount.');
          }
          const response = await sendSOL(process.env.TEST_BUY_ADDRESS, amount);
          bot.sendMessage(chatId, response);
        });
      });
    } else {
      const amount = parseFloat(data.split('_')[1]);
      const response = await sendSOL(process.env.TEST_BUY_ADDRESS, amount);
      bot.sendMessage(chatId, response);
    }
  }
});

// 🔁 Wallet Tracker (private reply only)
bot.onText(/\/mywallet/, async (msg) => {
  const userId = msg.from.id;
  const result = await checkWallet(userId, bot);
  bot.sendMessage(userId, result, { parse_mode: 'Markdown' });
});
