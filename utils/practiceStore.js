const store = new Map();

function formatBalance(balance) {
  return `💰 Balance: ${balance.toFixed(2)} SOL`;
}

async function handleCommand(userId, command, amount) {
  let balance = store.get(userId) || 100;

  switch (command) {
    case 'start':
      store.set(userId, 100);
      return '✅ Practice mode started. Balance reset to 100 SOL.';
    case 'balance':
      return formatBalance(balance);
    case 'buy':
      if (!amount || isNaN(amount)) return '❌ Invalid buy amount.';
      if (balance < parseFloat(amount)) return '❌ Insufficient balance.';
      balance -= parseFloat(amount);
      store.set(userId, balance);
      return `🟢 Bought for ${amount} SOL\n${formatBalance(balance)}`;
    case 'sell':
      if (!amount || isNaN(amount)) return '❌ Invalid sell amount.';
      balance += parseFloat(amount);
      store.set(userId, balance);
      return `🔴 Sold for ${amount} SOL\n${formatBalance(balance)}`;
    default:
      return '❓ Unknown command.';
  }
}

module.exports = { handleCommand };
