import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

export async function checkWallet() {
  try {
    const response = await fetch(`https://public-api.birdeye.so/defi/token_balance?wallet=${WALLET_ADDRESS}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-chain': 'solana',
        'X-API-KEY': BIRDEYE_API_KEY, // ✅ THIS IS THE FIX
      },
    });

    const data = await response.json();

    if (!data.success) {
      console.error('❌ Wallet check failed — full response:');
      console.error(JSON.stringify(data, null, 2));
      return;
    }

    console.log('✅ Wallet check succeeded:', data);
  } catch (error) {
    console.error('❌ Wallet check failed:', error.message);
  }
}
