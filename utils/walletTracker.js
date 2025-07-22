const fetch = require('node-fetch');
require('dotenv').config();

const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

async function checkWallet() {
  if (!BIRDEYE_API_KEY || !WALLET_ADDRESS) {
    console.error('❌ Missing API key or wallet address in .env');
    return;
  }

  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/token_balance?wallet=${WALLET_ADDRESS}`,
      {
        headers: {
          'accept': 'application/json',
          'x-chain': 'solana',
          'X-API-KEY': BIRDEYE_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error('❌ Wallet check failed — response:');
      console.error(JSON.stringify(data, null, 2));
      return;
    }

    console.log('✅ Wallet check succeeded:', data);
  } catch (err) {
    console.error('❌ Wallet check failed:', err.message);
  }
}

module.exports = { checkWallet };
