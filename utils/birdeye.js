module.exports = {
  getNewLaunch: async () => {
    // Simulated token launch — replace with real-time polling later
    const tokens = [
      { symbol: '$MOON', price: 0.0009 },
      { symbol: '$RUG', price: 0.002 },
      { symbol: '$APE', price: 0.0015 },
    ];

    const picked = tokens[Math.floor(Math.random() * tokens.length)];

    return {
      symbol: picked.symbol,
      price: picked.price,
      isNew: true,
    };
  }
};
