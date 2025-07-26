require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const checkWallet = require('./utils/checkWallet');
const fs = require('fs');
const path = require('path');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const groupId = process.env.GROUP_ID;

console.log("🐺 Wolf of Wall Street | SheepTrackerBot is LIVE...");

// Storage for per-user wallet map
const userWalletsPath = path.join(__dirname, 'data', 'user_wallets.json');
if (!fs.existsSync(userWalletsPath)) fs.writeFileSync(userWalletsPath, '{}');

// 🔁 Run Wallet Checker (for all saved users)
setInterval(() => {
  const wallets = JSON.parse(fs.readFileSync(userWalletsPath));
  Object.entries(wallets).forEach(([userId, wallet]) => {
    checkWallet(bot, userId, wallet, process.env.BIRDEYE_API_KEY);
  });
}, 20000);

// 💼 Set Wallet
bot.onText(/\/setwallet (.+)/, (msg, match) => {
  const userId = msg.from.id;
  const wallet = match[1];
  const wallets = JSON.parse(fs.readFileSync(userWalletsPath));
  wallets[userId] = wallet;
  fs.writeFileSync(userWalletsPath, JSON.stringify(wallets, null, 2));
  bot.sendMessage(userId, `✅ Wallet set to: ${wallet}`);
});

// 👁️ View Wallet
bot.onText(/\/mywallet/, (msg) => {
  const userId = msg.from.id;
  const wallets = JSON.parse(fs.readFileSync(userWalletsPath));
  const wallet = wallets[userId];
  if (!wallet) return bot.sendMessage(userId, `❌ No wallet set. Use /setwallet <address>`);
  bot.sendMessage(userId, `👛 Your wallet: ${wallet}`);
});

// 🔁 Ping Test
bot.onText(/\/ping/, (msg) => {
  bot.sendMessage(msg.chat.id, '📡 pong');
});

// 📢 Help Command
bot.onText(/\/help/, (msg) => {
  const helpText = `🐺 *Wolf of Wall Street Commands:*

/setwallet <addr> - Link your wallet
/mywallet - View wallet
/ping - Test
/buy <amount> - Manual buy (soon)
/sell <amount> - Manual sell (soon)

_Inline trading, auto mode, and sniper alerts coming next..._
`;
  bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
});
