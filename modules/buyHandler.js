const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction } = require('@solana/web3.js');
require('dotenv').config();

const connection = new Connection(process.env.RPC_URL, 'confirmed');
const BUY_WALLET = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.BUY_WALLET)));

async function buySOL(fromAddress, amountSOL, userId, bot) {
  try {
    const toPubkey = new PublicKey(fromAddress);
    const lamports = amountSOL * LAMPORTS_PER_SOL;

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: BUY_WALLET.publicKey,
        toPubkey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, tx, [BUY_WALLET]);
    await bot.sendMessage(userId, `✅ Sent ${amountSOL} SOL to ${fromAddress}\n🧾 Tx: https://solscan.io/tx/${signature}`);

  } catch (err) {
    console.error('❌ Buy Error:', err.message);
    await bot.sendMessage(userId, `❌ Error sending SOL: ${err.message}`);
  }
}

module.exports = { buySOL };
