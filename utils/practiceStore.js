const userData = {};

function checkPracticeMode(userId, action, amount) {
  if (!userData[userId]) {
    userData[userId] = { balance: 1000 };
  }

  if (action === 'start') {
    userData[userId].balance = 1000;
    return `🧪 Practice mode started! You have $1000 in virtual funds.`;
  }

  if (action === 'balance') {
    return `💰 Your current virtual balance is $${userData[userId].balance.toFixed(2)}.`;
  }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) {
    return `❌ Invalid amount.`;
  }

  if (action === 'buy') {
    if (userData[userId].balance < amount) {
      return `❌ Not enough funds. You only have $${userData[userId].balance.toFixed(2)}.`;
    }
    userData[userId].balance -= amount;
    return `✅ You bought for $${amount.toFixed(2)}. Remaining: $${userData[userId].balance.toFixed(2)}.`;
  }

  if (action === 'sell') {
    userData[userId].balance += amount;
    return `✅ You sold for $${amount.toFixed(2)}. New balance: $${userData[userId].balance.toFixed(2)}.`;
  }

  return `❌ Unknown action.`;
}

module.exports = checkPracticeMode;
