const practiceData = {};

function ensureUser(userId) {
  if (!practiceData[userId]) {
    practiceData[userId] = {
      balance: 1000,
      pnl: 0
    };
  }
}

async function startPractice(userId) {
  ensureUser(userId);
  return `🚀 Practice mode started! Balance: $${practiceData[userId].balance.toFixed(2)}`;
}

async function mockBuy(userId, amount) {
  ensureUser(userId);
  if (amount > practiceData[userId].balance) {
    return `❌ Not enough balance. Available: $${practiceData[userId].balance.toFixed(2)}`;
  }
  practiceData[userId].balance -= amount;
  practiceData[userId].pnl -= amount;
  return `🛒 Bought $${amount.toFixed(2)} — New Balance: $${practiceData[userId].balance.toFixed(2)}`;
}

async function mockSell(userId, amount) {
  ensureUser(userId);
  practiceData[userId].balance += amount;
  practiceData[userId].pnl += amount;
  return `💵 Sold $${amount.toFixed(2)} — New Balance: $${practiceData[userId].balance.toFixed(2)}`;
}

async function checkBalance(userId) {
  ensureUser(userId);
  const { balance, pnl } = practiceData[userId];
  return `📊 Balance: $${balance.toFixed(2)}\n📈 P&L: $${pnl.toFixed(2)}`;
}

async function resetPractice(userId) {
  practiceData[userId] = { balance: 1000, pnl: 0 };
  return `♻️ Practice account reset. Starting over with $1000.`;
}

module.exports = {
  startPractice,
  mockBuy,
  mockSell,
  checkBalance,
  resetPractice
};
