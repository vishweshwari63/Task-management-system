const evaluateBadges = (completedCount, streak) => {
  const badges = [];

  if (completedCount >= 1) {
    badges.push('🏅 First Task');
  }
  if (streak >= 7) {
    badges.push('🔥 7 Day Streak');
  }
  if (completedCount >= 50) {
    badges.push('⚡ 50 Tasks Completed');
  }
  if (completedCount >= 20 && streak >= 5) {
    badges.push('👑 Productivity Master');
  }

  return badges;
};

module.exports = { evaluateBadges };
