// modules/tradeButtons.js

const { InlineKeyboardButton, InlineKeyboardMarkup } = require('node-telegram-keyboard-wrapper');

function getTradeButtons(mode = 'practice') {
  const suffix = mode === 'real' ? '' : '_practice';

  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💰 Buy 0.05 SOL', callback_data: `buy_0.05${suffix}` },
          { text: '💰 Buy 0.1 SOL', callback_data: `buy_0.1${suffix}` },
          { text: '💰 Buy 0.25 SOL', callback_data: `buy_0.25${suffix}` }
        ],
        [
          { text: '🧾 Custom Buy', callback_data: `custom_buy${suffix}` },
          { text: '🧾 Custom Sell', callback_data: `custom_sell${suffix}` }
        ],
        [
          { text: '💸 Sell All', callback_data: `sell_all${suffix}` },
          { text: '🔙 Cancel', callback_data: `cancel_trade` }
        ]
      ]
    }
  };
}

module.exports = { getTradeButtons };
