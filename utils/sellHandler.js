// sellHandler.js

const TelegramBot = require('node-telegram-bot-api');
const { sendSOL } = require('./utils/solTransfer');
const { savePracticeBalance, getPracticeBalance } = require('./utils/practiceBalance');

async function handleSell(bot, msg, userId, args, isPractice = false) {
  const chatId = msg.chat.id;
  let sellAmount;

  // Parse sell amount (can be from button or text command)
  if (args.length > 0) {
    const input = args[0].replace(/[^0-9.]/g, '');
    sellAmount = parseFloat(input);
  }

  if (!sellAmount || isNaN(sellAmount) || sellAmount <= 0) {
    return bot.sendMessage(chatId, '❌ Invalid sell amount. Use /sell <amount>');
  }

  if (isPractice) {
    const currentBalance = await getPracticeBalance(userId);
    if (currentBalance < sellAmount) {
      return bot.sendMessage(chatId, `❌ You only have ${currentBalance} SOL in practice mode.`);
    }
    const newBalance = currentBalance - sellAmount;
    await savePracticeBalance(userId, newBalance);
    return bot.sendMessage(chatId, `✅ Sold ${sellAmount} SOL in practice mode. Remaining: ${newBalance.toFixed(4)} SOL`);
  } else {
    try {
      const result = await sendSOL(process.env.BUY_WALLET, process.env.SELL_WALLET, sellAmount);
      return bot.sendMessage(chatId, `✅ Real sell executed: ${sellAmount} SOL sent to sell wallet.`);
    } catch (err) {
      console.error('Sell failed:', err.message);
      return bot.sendMessage(chatId, '❌ Sell failed. Please try again later.');
    }
  }
}

module.exports = handleSell;
