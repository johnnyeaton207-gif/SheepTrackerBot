const fetch = require('node-fetch');

const WALLET = 'X7sRZF4yodAZCDLnAb3aKA94BZwXX1wxuWEGnGyU4Gz';
const API_KEY = process.env.BIRDEYE_API_KEY;
const trackedMints = new Set();

async function getTokenPrice(mint) {
  try {
    const res = await fetch(`https://public-api.birdeye.so/defi/price?address=${mint}&ui_amount_mode=raw`, {
      headers: {
        'x-chain': 'solana',
        'x-api-key': API_KEY,
        'accept': 'application/json'
      }
    });

    const data = await res.json();
    return data?.data?.value || null;
  } catch (err) {
    console.error('❌ Price fetch failed:', err.message);
    return null;
  }
}

async function checkWallet(bot, groupId) {
  try {
    const url = `https://public-api.birdeye.so/defi/wallet/token-list?wallet=${WALLET}`;
   const res = await fetch(url, {
  headers: {
    'x-chain': 'solana',
    'x-api-key': API_KEY,
    'accept': 'application/json'
  }
});


    const data = await res.json();

    if (!data?.data?.tokens) {
      console.error('❌ Birdeye wallet check failed — Full response:');
      console.error(JSON.stringify(data, null, 2));
      return;
    }

    const tokens = data.data.tokens;

    for (const token of tokens) {
      if (!trackedMints.has(token.mint)) {
        trackedMints.add(token.mint);
        const name = token.name || 'Unknown';
        const symbol = token.symbol || '';
        const amount = parseFloat(token.uiAmountString || '0');
        const price = await getTokenPrice(token.mint);

        let message = `🔔 New token detected:\n${name} (${symbol})\nAmount: ${amount}`;

        if (price !== null) {
          const usdValue = (amount * price).toFixed(4);
          message += `\n💰 Price: $${price.toFixed(6)}\n📊 Est. Value: $${usdValue}`;
        }

        bot.sendMessage(groupId, message);
      }
    }
  } catch (err) {
    console.error('❌ Wallet check failed:', err.message);
  }
}

module.exports = checkWallet;
