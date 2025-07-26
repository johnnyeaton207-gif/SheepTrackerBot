// ⏱️ Periodic check, but don't send message to group
setInterval(() => {
  checkWallet(bot, groupId, process.env.WALLET_ADDRESS, process.env.BIRDEYE_API_KEY, process.env.SOLANA_RPC, true);
}, 20000);

// 🔍 User command to check any wallet manually
bot.onText(/\/checkwallet (.+)/, async (msg, match) => {
  const wallet = match[1];
  const res = await checkWallet(bot, msg.chat.id, wallet, process.env.BIRDEYE_API_KEY, process.env.SOLANA_RPC, false);
});
