// utils/practiceStore.js
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/practice_balances.json');

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({}));
}

const balances = JSON.parse(fs.readFileSync(dataPath));

function saveBalances() {
  fs.writeFileSync(dataPath, JSON.stringify(balances, null, 2));
}

async function checkPracticeMode(userId, action, amount) {
  if (!balances[userId]) {
    balances[userId] = { balance: 1000 }; // default starting balance
  }

  let msg = '';
  const user = balances[userId];

  switch (action) {
    case 'start':
      user.balance = 1000;
      msg = `🧪 Practice mode started. Balance set to 1000 SOL.`;
      break;

    case 'buy':
      const buyAmt = parseFloat(amount);
      if (buyAmt > user.balance) {
        msg = `❌ Not enough balance. You have ${user.balance.toFixed(2)} SOL.`;
      } else {
        user.balance -= buyAmt;
        msg = `✅ Bought token for ${buyAmt} SOL.\n💰 New Balance: ${user.balance.toFixed(2)} SOL.`;
      }
      break;

    case 'sell':
      const sellAmt = parseFloat(amount);
      user.balance += sellAmt;
      msg = `✅ Sold token for ${sellAmt} SOL.\n💰 New Balance: ${user.balance.toFixed(2)} SOL.`;
      break;

    case 'balance':
      msg = `💼 Practice Balance: ${user.balance.toFixed(2)} SOL.`;
      break;

    default:
      msg = '❓ Unknown action.';
  }

  saveBalances();
  return msg;
}

module.exports = checkPracticeMode;
