// index.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getBuySellKeyboard } = require('./modules/inlineButtons');
const buyHandler = require('./modules/buyHandler');
const checkWallet = require('./utils/checkWallet');
const fs = require('fs');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;

console.log('✅ SheepTrackerBot is running...');

bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const isGroup = msg.chat.id !== userId;
  const welcome = `🐺 *Welcome to SheepTrackerBot!*

Use the buttons below to test a buy or sell.
(This is practice mode unless configured otherwise)`;

  if (!isGroup) {
    bot.sendMessage(userId, welcome, {
      parse_mode: 'Markdown',
      ...getBuySellKeyboard()
    });
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  if (data.startsWith("buy_")) {
    const amount = parseFloat(data.split("_")[1]);
    await buyHandler(bot, userId, amount);
    return bot.answerCallbackQuery(query.id);
  }

  if (data === "custom_buy") {
    bot.sendMessage(userId, "✏️ Enter custom buy amount in SOL:");
    bot.once("message", async (msg) => {
      const amt = parseFloat(msg.text);
      if (!isNaN(amt)) {
        await buyHandler(bot, userId, amt);
      } else {
        bot.sendMessage(userId, "❌ Invalid amount.");
      }
    });
    return bot.answerCallbackQuery(query.id);
  }

  if (data === "sell_all") {
    bot.sendMessage(userId, "⚡ Sell All - Feature coming soon");
    return bot.answerCallbackQuery(query.id);
  }

  if (data === "custom_sell") {
    bot.sendMessage(userId, "✏️ Enter custom sell amount in SOL:");
    bot.once("message", async (msg) => {
      const amt = parseFloat(msg.text);
      if (!isNaN(amt)) {
        bot.sendMessage(userId, `🛠 Selling ${amt} SOL (feature coming soon)`);
      } else {
        bot.sendMessage(userId, "❌ Invalid amount.");
      }
    });
    return bot.answerCallbackQuery(query.id);
  }
});
