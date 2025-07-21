module.exports = {
  swap: async ({ from, to, amount }) => {
    // Simulate a swap response
    console.log(`🔁 Swapping ${amount} ${from} → ${to}...`);

    // Simulated swap rate
    const rate = Math.random() * (1.5 - 0.7) + 0.7; // ~0.7x–1.5x return

    return {
      success: true,
      receivedAmount: (amount * rate).toFixed(4),
      rate: rate.toFixed(2),
    };
  }
};
