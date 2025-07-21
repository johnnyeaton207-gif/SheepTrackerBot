module.exports = {
  run: async (tokenAddress) => {
    // This is a fake RugCheck simulation.
    // Replace this with a real API call if you want to go pro.

    const isSafe = Math.random() > 0.2; // 80% chance it's "safe"

    return {
      isSafe,
      reason: isSafe ? 'No blacklist or honeypot detected.' : '⚠️ Possible blacklist/honeypot behavior.',
    };
  },
};
