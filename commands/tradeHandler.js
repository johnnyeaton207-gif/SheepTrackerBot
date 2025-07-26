// commands/tradeHandler.js
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const TRADE_STATE_FILE = path.join(__dirname, '../data/trade_states.json');
if (!fs.existsSync(TRADE_STATE_FILE)) fs.writeFileSync(TRADE_STATE_FILE, '{}');

function saveTradeState(userId, state) {
  const data = JSON.parse(fs.readFileSync(TRADE_STATE_FILE));
  data[userId] = state;
  fs.writeFileSync(TRADE_STATE_FILE, JSON.stringify(data, null, 2));
}

function getTradeState(userId) {
  const data = JSON.parse(fs.readFileSync(TRADE_STATE_FILE));
  return data[userId];
}

module.exports = (bot) => {
  bot.onText(/\/(buy|sell)menu/, (msg) => {
    const userId = msg.from.id;
    const action = msg.text.includes('buy') ? 'buy' : 'sell';

    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '0.05 SOL', callback_data: `${action}:0.05` },
            { text: '0.1 SOL', callback_data: `${action}:0.1` },
          ],
          [
            { text: 'Custom Amount', callback_data: `${action}:custom` }
          ]
        ]
      }
    };
    bot.sendMessage(msg.chat.id, `Choose how much SOL to ${action.toUpperCase()}:`, options);
  });

  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const userId = callbackQuery.from.id;
    const [action, amount] = callbackQuery.data.split(':');

    if (amount === 'custom') {
      saveTradeState(userId, { action });
      bot.sendMessage(userId, `Please enter the amount of SOL to ${action.toUpperCase()}:`);
    } else {
      bot.sendMessage(userId, `🟢 ${action.toUpperCase()} ${amount} SOL (preset)`);
      // TODO: trigger actual trade logic here
    }
  });

  bot.on('message', (msg) => {
    const userId = msg.from.id;
    const state = getTradeState(userId);
    if (state && !msg.text.startsWith('/')) {
      const amount = parseFloat(msg.text);
      if (!isNaN(amount)) {
        bot.sendMessage(userId, `🟢 ${state.action.toUpperCase()} ${amount} SOL (custom)`);
        // TODO: trigger actual trade logic here
        saveTradeState(userId, null);
      } else {
        bot.sendMessage(userId, '❌ Invalid amount. Please enter a number.');
      }
    }
  });
};
