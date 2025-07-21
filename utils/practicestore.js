// utils/practiceStore.js
const practiceBuys = {};

function addBuy(userId, token, amount, timestamp = Date.now()) {
  if (!practiceBuys[userId]) practiceBuys[userId] = [];
  practiceBuys[userId].push({ token, amount, timestamp });
}

function getBuys(userId) {
  return practiceBuys[userId] || [];
}

function clearBuys(userId) {
  practiceBuys[userId] = [];
}

module.exports = {
  addBuy,
  getBuys,
  clearBuys
};
