// modules/inlineButtons.js

const { InlineKeyboardButton, InlineKeyboardMarkup } = require('node-telegram-bot-api');

function getBuySellKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "💰 Buy 0.05 SOL", callback_data: "buy_0.05" },
          { text: "💰 Buy 0.1 SOL", callback_data: "buy_0.1" },
          { text: "💰 Buy 0.25 SOL", callback_data: "buy_0.25" }
        ],
        [
          { text: "✏️ Custom Buy Amount", callback_data: "custom_buy" }
        ],
        [
          { text: "💸 Sell All", callback_data: "sell_all" },
          { text: "✏️ Custom Sell Amount", callback_data: "custom_sell" }
        ]
      ]
    }
  };
}

module.exports = {
  getBuySellKeyboard
};
