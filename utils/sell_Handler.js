// utils/sellHandler.js

const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const fetch = require('node-fetch');

const connection = new Connection(process.env.RPC_URL, 'confirmed');
const sellWallet = Keypair.fromSecretKey(bs58.decode(process.env.SELL_WALLET));

async function getTokenData(symbol, apiKey) {
  const url = `https://public-api.birdeye.so/defi/token/search?query=${symbol}`;
  const response = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'x-api-key': apiKey,
      'x-chain': 'solana'
    }
  });

  const data = await response.json();
  if (!data?.data?.length) return null;
  return data.data[0];
}

async function sellToken(symbol, amountSOL) {
  const tokenInfo = await getTokenData(symbol, process.env.BIRDEYE_API_KEY);
  if (!tokenInfo) throw new Error(`❌ Token ${symbol} not found.`);

  // Placeholder for actual swap logic
  console.log(`(MOCK) Selling ${amountSOL} SOL of ${tokenInfo.symbol} (${tokenInfo.address})`);

  return {
    success: true,
    message: `✅ (MOCK) Sold ${amountSOL} SOL of ${tokenInfo.symbol}`
  };
}

module.exports = sellToken;
