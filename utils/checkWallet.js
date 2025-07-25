const fetch = require('node-fetch');

async function fetchSPLTokens(wallet, apiKey) {
  const url = `https://public-api.birdeye.so/defi/wallet/token_list?wallet=${wallet}`;
  try {
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'x-api-key': apiKey,
        'x-chain': 'solana'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (err) {
    console.error('❌ SPL token fetch failed:', err.message);
    return [];
  }
}

async function fetchSOLBalance(wallet, rpcUrl) {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [wallet]
      })
    });

    const json = await response.json();
    const lamports = json?.result?.value;
    return lamports ? lamports / 1e9 : 0;
  } catch (err) {
    console.error('❌ SOL balance fetch failed:', err.message);
    return 0;
  }
}

module.exports = async function checkWallet(bot, groupId, wallet, apiKey) {
  const rpcUrl = process.env.RPC_URL;
  const splTokens = await fetchSPLTokens(wallet, apiKey);
  const solBalance = await fetchSOLBalance(wallet, rpcUrl);

  if (splTokens.length > 0) {
    const sorted = splTokens.sort((a, b) => b.ui_amount - a.ui_amount);
    const top = sorted.slice(0, 5);
    const message = `📊 Top Tokens in Wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)}:\n` +
      top.map(token => `• ${token.symbol || token.token_address.slice(0, 6)}: ${token.ui_amount.toFixed(2)}`).join('\n');
    bot.sendMessage(groupId, message);
  } else if (solBalance > 0) {
    const message = `💰 Wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)} holds:\n• SOL: ${solBalance.toFixed(4)}`;
    bot.sendMessage(groupId, message);
  } else {
    bot.sendMessage(groupId, `⚠️ No tokens found in wallet ${wallet.slice(0, 4)}...${wallet.slice(-4)}.`);
  }
};
