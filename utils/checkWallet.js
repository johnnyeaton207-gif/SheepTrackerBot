const fetch = require('node-fetch');

const BIRDEYE_API_KEY = '88dfeb8d4a07419699417bdddc0960ce';

async function fetchWalletTokens(wallet) {
  const url = `https://public-api.birdeye.so/defi/tokenlist?wallet=${wallet}`;

  try {
    console.log(`🔍 Fetching tokens for wallet: ${wallet}`);
    console.log(`🔑 API Key: ${BIRDEYE_API_KEY}`);
    console.log(`🌐 URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'x-api-key': BIRDEYE_API_KEY,
        'x-chain': 'solana'
      }
    });

    const body = await response.text();
    console.log(`📥 Status: ${response.status}`);
    console.log(`📥 Body: ${body}`);

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${body}`);

    const data = JSON.parse(body);
    if (!data || !Array.isArray(data.data)) throw new Error('❌ Unexpected format');

    return data.data;
  } catch (err) {
    console.error('❌ Wallet check failed:', err.message);
    return [];
  }
}

module.exports = async function checkWallet(bot, groupId, wallet) {
  const tokens = await fetchWalletTokens(wallet);
  if (!tokens.length) {
    console.warn("⚠️ No tokens found or wallet check failed.");
    return;
  }

  const sorted = tokens.sort((a, b) => b.ui_amount - a.ui_amount);
  const top = sorted.slice(0, 5);

  const message = `📊 Top Tokens in Wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)}:\n` +
    top.map(token => `• ${token.symbol || token.token_address.slice(0, 6)}: ${token.ui_amount.toFixed(2)}`).join('\n');

  bot.sendMessage(groupId, message);
};
