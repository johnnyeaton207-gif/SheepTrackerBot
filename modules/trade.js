// modules/trade.js
const {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} = require('@solana/web3.js');

require('dotenv').config();

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

// This keypair must be securely loaded for sending SOL (e.g., funded Phantom hot wallet)
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY); // stored as JSON array
const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

async function sendSOL(recipientAddress, amountInSol) {
  try {
    const recipient = new PublicKey(recipientAddress);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipient,
        lamports: amountInSol * 1e9 // Convert SOL to lamports
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
    return `✅ Sent ${amountInSol} SOL to ${recipientAddress}\n🔗 Txn: https://solscan.io/tx/${signature}`;
  } catch (err) {
    return `❌ Transaction failed: ${err.message}`;
  }
}

module.exports = sendSOL;
