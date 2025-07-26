// utils/realTradeHandler.js
const { Connection, PublicKey, Keypair, sendAndConfirmTransaction, SystemProgram, Transaction } = require('@solana/web3.js');
require('dotenv').config();

const connection = new Connection(process.env.RPC_URL);
const buyWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.BUY_WALLET_SECRET))); // Save as array string in Railway
const sellWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SELL_WALLET_SECRET)));

async function sendSol(fromKeypair, toPublicKey, amountSol) {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new PublicKey(toPublicKey),
        lamports: amountSol * 1e9
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    console.log(`✅ Sent ${amountSol} SOL to ${toPublicKey}. Tx: ${signature}`);
    return signature;
  } catch (err) {
    console.error('❌ Transaction failed:', err.message);
    return null;
  }
}

module.exports = {
  executeBuy: async (amount) => sendSol(buyWallet, process.env.PRACTICE_WALLET, amount),
  executeSell: async (amount) => sendSol(sellWallet, process.env.PRACTICE_WALLET, amount) // You can swap this to a sell wallet logic later
};
