const fetch = require('node-fetch');

const wallet = 'X7sRZF4yodAZCDLnAb3aKA94BZwXX1wxuWEGnGyU4Gz';
const url = `https://public-api.birdeye.so/defi/wallet/token_list?wallet=${wallet}`;

const headers = {
  'accept': 'application/json',
  'x-chain': 'solana',
  'X-API-KEY': '3b9d49cb-33db-47d6-8c14-e0405c4c3c2e' // hardcoded for now
};

(async () => {
  try {
    const response = await fetch(url, { headers });
    const data = await response.text();

    console.log(`✅ Status: ${response.status}`);
    console.log(`🧾 Response: ${data}`);
  } catch (err) {
    console.error(`❌ Error:`, err);
  }
})();
