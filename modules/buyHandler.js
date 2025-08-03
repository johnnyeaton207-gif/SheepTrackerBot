const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');
const { default: fetch } = require('node-fetch');
const { getSwapIxFromJupiter } = require('./jupiter');

// Setup connection
const connection = new Connection(process.env.RPC_URL, 'confirmed');

// Load and decode secret key from .env as Uint8Array
const rawSecret = JSON.parse(process.env.BUY_WALLET_SECRET);
const secretKey = Uint8Array.from(rawSecret);
const buyerKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(buySecret)));


async function executeBuy(mint, amountSol, tokenName = 'Unknown') {
  try {
    const lamports = amountSol * LAMPORTS_PER_SOL;
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${mint}&amount=${lamports}&slippage=1`;

    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();

    if (!quoteData || !quoteData.data || quoteData.data.length === 0) {
      throw new Error('No swap route found.');
    }

    const route = quoteData.data[0];

    const swapIx = await getSwapIxFromJupiter(
      route,
      buyerKeypair.publicKey.toBase58()
    );
    const transaction = Transaction.from(
      Buffer.from(swapIx.swapTransaction, 'base64')
    );
    transaction.feePayer = buyerKeypair.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const txid = await sendAndConfirmTransaction(connection, transaction, [
      buyerKeypair,
    ]);

    console.log(`✅ Bought ${tokenName} (${mint}) for ${amountSol} SOL`);
    return txid;
  } catch (err) {
    console.error('❌ Buy failed:', err.message || err);
    return null;
  }
}

module.exports = { executeBuy };
