require('dotenv').config();
const fetch = require('node-fetch');
const { Connection, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Local wallet store
const walletStorePath = path.join(__dirname, '../data/user_wallets.json');

// Ensure file exists
if (!fs.existsSync(walletStorePath)) fs.writeFileSync(walletStorePath, '{}', 'utf-8');

function saveUserWallet(userId, wallet) {
  const store = JSON.parse(fs.readFileSync(walletStorePath, 'utf-8'));
  store[userId] = wallet;
  fs.writeFileSync(walletStorePath, JSON.stringify(store, null, 2));
}

function getUserWallet(userId) {
  const store = JSON.parse(fs.readFileSync(walletStorePath, 'utf-8'));
  return store[userId];
}

async function fetchSOLBalance(wallet) {
  try {
    const connection = new Connection(process.env.RPC_URL);
    const publicKey = new PublicKey(wallet);
    const balanceLamports = await connection.getBalance(publicKey);
    return balanceLamports / 1e9; // SOL
  } catch (err) {
    console.error("❌ SOL balance fetch error:", err.message);
    return null;
  }
}

async function fetchSPLTokens(wallet) {
  const url = `https://public-api.birdeye.so/defi/wallet/token_list?wallet=${wallet}`;
  try {
    const res = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'x-api-key': process.env.BIRDEYE_API_KEY,
        'x-chain': 'solana'
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.data)) return [];

    return data.data.filter(t => t.ui_amount > 0);
  } catch (err) {
    console.error("❌ SPL token fetch error:", err.message);
    return [];
  }
}

module.exports = async function checkWallet(bot, chatId, userWallet = null, silent = false) {
  const wallet = userWallet || getUserWallet(chatId) || process.env.WALLET_ADDRESS;
  if (!wallet) return bot.sendMessage(chatId, "⚠️ No wallet set. Use /setwallet [address]");

  const sol = await fetchSOLBalance(wallet);
  const tokens = await fetchSPLTokens(wallet);

  let msg = `📍 Wallet: \`${wallet}\`\n\n`;
  if (sol !== null) msg += `💰 SOL Balance: ${sol.toFixed(4)} SOL\n`;

  if (tokens.length > 0) {
    const top = tokens.sort((a, b) => b.ui_amount - a.ui_amount).slice(0, 5);
    msg += `\n📊 Top SPL Tokens:\n` + top.map(t =>
      `• ${t.symbol || t.token_address.slice(0, 6)}: ${t.ui_amount.toFixed(2)}`
    ).join('\n');
  } else {
    msg += "\n⚠️ No SPL tokens found.";
  }

  if (!silent) {
    bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
  }

  return msg; // for internal call if needed
};

// Export wallet save/get for index
module.exports.saveUserWallet = saveUserWallet;
module.exports.getUserWallet = getUserWallet;
