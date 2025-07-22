const fetch = require('node-fetch');

// Fetch the list of tokens in the wallet using Birdeye API
async function fetchWalletTokens(wallet, apiKey) {
  const url = `https://public-api.birdeye.so/wallet/token_list?wallet=${wallet}`;

  try {
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'x-chain': 'solana',
        'X-API-KEY': apiKey  // Your working API key
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    if (!data || !data.data || !Array.isArray(data.data.tokens)) {
      throw new Error('❌ Wallet check failed — Unexpected response format');
    }

    return data.data.tokens;
  } catch (err) {
    console.error('❌ Wallet check failed:', err.message);
    return [];
  }
}

// Exported function for use in your bot
module.exports = async function checkWallet(bot, groupId, wallet) {
  const apiKey = '1b3def4fcb234de48b834dc9aa819092'; // ✅ Use your real Birdeye API key here

  const tokens = await fetchWalletTokens(wallet, apiKey);
  if (!tokens.length) return;

  const sorted = tokens.sort((a, b) => b.ui_amount - a.ui_amount);
  const top = sorted.slice(0, 5);

  const message = `📊 Top Tokens in Wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)}:\n` +
    top.map(token => `• ${token.symbol || token.token_address.slice(0, 6)}: ${token.ui_amount.toFixed(2)}`).join('\n');

  bot.sendMessage(groupId, message);
};
