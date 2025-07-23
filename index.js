require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/walletTracker');
const { handleCommand } = require('./utils/practiceStore');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;

console.log("✅ SheepTrackerBot is running...");
console.log("Wallet:", process.env.WALLET_ADDRESS);
console.log("API Key:", process.env.BIRDEYE_API_KEY);

// 🔁 Wallet Tracker every 20s
setInterval(() => {
  checkWallet(bot, groupId, process.env.WALLET_ADDRESS, process.env.BIRDEYE_API_KEY);
}, 20000);

// 🧪 Practice Commands
bot.onText(/\/(start|buy|sell|balance)(?: (.+))?/, async (msg, match) => {
  const cmd = match[1];
  const param = match[2];
  const userId = msg.from.id;
  const result = await handleCommand(userId, cmd, param);
  bot.sendMessage(msg.chat.id, result);
});

// 🔁 Ping
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, 'pong');
});
