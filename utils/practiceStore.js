// utils/practiceStore.js

const balances = {};

// Helper to ensure user/token balance exists
function initBalance(userId, symbol) {
  if (!balances[userId]) balances[userId] = {};
  if (!balances[userId][symbol]) balances[userId][symbol] = 0;
}

// Main function
module.exports = async function practiceStore(userId, action, symbol, amount = 0) {
  symbol = symbol.toUpperCase();

  if (action === 'start') {
    balances[userId] = {}; // Reset user's balances
    return '🧪 Practice mode started. Use /buy SYMBOL AMOUNT or /sell SYMBOL AMOUNT';
  }

  if (!symbol || !userId) return '⚠️ Missing user or symbol.';

  initBalance(userId, symbol);

  if (action === 'buy') {
    balances[userId][symbol] += parseFloat(amount);
    return `✅ Bought ${amount} ${symbol}. New balance: ${balances[userId][symbol].toFixed(4)} ${symbol}`;
  }

  if (action === 'sell') {
    if (balances[userId][symbol] < parseFloat(amount)) {
      return `❌ Not enough ${symbol} to sell. Current balance: ${balances[userId][symbol].toFixed(4)} ${symbol}`;
    }
    balances[userId][symbol] -= parseFloat(amount);
    return `✅ Sold ${amount} ${symbol}. New balance: ${balances[userId][symbol].toFixed(4)} ${symbol}`;
  }

  if (action === 'balance') {
    const tokens = Object.entries(balances[userId] || {});
    if (tokens.length === 0) return '📭 No balances. Use /buy to get started.';
    return '💼 Your balances:\n' + tokens.map(([sym, amt]) => `• ${sym}: ${amt.toFixed(4)}`).join('\n');
  }

  return '⚠️ Unknown action.';
};
