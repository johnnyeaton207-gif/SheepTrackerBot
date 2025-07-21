const fetch = require('node-fetch');
const WALLET = process.env.WALLET_ADDRESS;
const trackedMints = new Set();

async function checkWallet(bot, groupId) {
  try {
    const url = `https://public-api.birdeye.so/public/wallet/token-list?wallet=${WALLET}`;
    const res = await fetch(url, {
      headers: {
        'x-chain': 'solana',
      }
    });
    const data = await res.json();
    const tokens = data.data.tokens;

    tokens.forEach((token) => {
      if (!trackedMints.has(token.mint)) {
        trackedMints.add(token.mint);
        const name = token.name || 'Unknown';
        const amount = parseFloat(token.uiAmountString || '0');

        if (amount > 0) {
          bot.sendMessage(groupId, `🔔 New token detected:\n${name}\nAmount: ${amount} ${token.symbol || ''}`);
        }
      }
    });
  } catch (err) {
    console.error('❌ Wallet check failed:', err.message);
  }
}

module.exports = checkWallet;
