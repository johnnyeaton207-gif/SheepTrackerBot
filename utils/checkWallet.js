// ✅ checkWallet.js (Full Updated Version)

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
    if (!json.result) throw new Error('No balance result');

    const lamports = json.result.value;
    return lamports / 1e9; // Convert to SOL
  } catch (err) {
    console.error('❌ SOL balance fetch failed:', err.message);
    return null;
  }
}

module.exports = async function checkWallet(bot, chatId, wallet, apiKey, rpcUrl, silent = false) {
  const splTokens = await fetchSPLTokens(wallet, apiKey);
  const sol = await fetchSOLBalance(wallet, rpcUrl);

  let response = `📊 Wallet Overview: ${wallet.slice(0, 4)}...${wallet.slice(-4)}\n`;

  if (sol !== null) response += `• SOL: ${sol.toFixed(4)}\n`;

  if (splTokens.length) {
    const top = splTokens.sort((a, b) => b.ui_amount - a.ui_amount).slice(0, 5);
    for (const token of top) {
      response += `• ${token.symbol || token.token_address.slice(0, 6)}: ${token.ui_amount.toFixed(2)}\n`;
    }
  } else {
    response += `• No SPL tokens found.`;
  }

  if (!silent) bot.sendMessage(chatId, response);

  return response;
};
