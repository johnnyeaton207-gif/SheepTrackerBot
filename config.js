module.exports = {
  mode: 'simauto', // Options: 'live', 'simauto', 'practice'

  tradeAmount: 0.1, // Amount of SOL to trade per snipe (real or simulated)

  tpMultiplier: 2.0, // Take Profit at 2x
  slThreshold: 0.35, // Stop loss at -35% (0.35 = 35%)

  enableWalletTracking: true,
  enableZombieScanner: true,

  trackedWallets: [
    'YourOtherWalletHereIfYouWantToMirror',
  ],

  simLogResults: true,
  showOnlyProfitableSim: false,

  pollInterval: 15000, // Check every 15 seconds
};
