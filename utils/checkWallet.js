const fetch = require('node-fetch');

async function fetchWalletTokens(wallet, apiKey) {
  const url = `https://public-api.birdeye.so/defi/wallet/token_list?wallet=${wallet}`;
  console.log(`🔍 Fetching tokens for wallet: ${wallet}`);
  console.log(`🔑 Using API Key: ${apiKey}`);
  console.log(`🌐 Request URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'x-chain': 'solana',
        'x-api-key': apiKey
      }
    });

    const rawBody = await response.text();

    console.log(`📥 Raw Response Status: ${response.status}`);
    console.log(`📥 Raw Response Body: ${rawBody}`);
    console.log(`📥 Raw Response Headers:`, response.headers.raw());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${rawBody}`);
    }

    const data = JSON.parse(rawBody);

    if (!data || !Array.isArray(data.data)) {
      throw new Error('❌ Wallet check failed — Unexpected response format');
    }

    return data.data;
  } catch (err) {
    console.error('❌ Wallet check failed:', err.message);
    return [];
  }
}

module.exports = async function checkWallet(bot, groupId, wallet, apiKey) {
  const tokens = await fetchWalletTokens(wallet, apiKey);
  if (!tokens.length) {
    console.log('⚠️ No tokens found or wallet check failed.');
    return;
  }

  const sorted = tokens.sort((a, b) => b.ui_amount - a.ui_amount);
  const top = sorted.slice(0, 5);

  const message = `📊 Top Tokens in Wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)}:\n` +
    top.map(token => `• ${token.symbol || token.token_address.slice(0, 6)}: ${token.ui_amount.toFixed(2)}`).join('\n');

  bot.sendMessage(groupId, message);
};
