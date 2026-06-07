const { evaluateBadges } = require('./badgeEvaluator');

global.mockUsers = global.mockUsers || [];
global.mockTasks = global.mockTasks || [];

// Helper to simulate streaks update
const checkStreakAndBadgesMock = (userId) => {
  const user = global.mockUsers.find(u => u._id === userId);
  if (!user) return;

  const completedCount = global.mockTasks.filter(t => t.userId === userId && t.status === 'Completed').length;
  user.completedTasksCount = completedCount;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (user.lastCompletedDate) {
    const lastDate = new Date(user.lastCompletedDate);
    const lastCompleted = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    const diffTime = Math.abs(today - lastCompleted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
      user.lastCompletedDate = today.toISOString();
    } else if (diffDays > 1) {
      user.streak = 1;
      user.lastCompletedDate = today.toISOString();
    } else {
      user.lastCompletedDate = today.toISOString();
    }
  } else {
    user.streak = 1;
    user.lastCompletedDate = today.toISOString();
  }

  user.badges = evaluateBadges(completedCount, user.streak);
};

const verifyStreakActiveMock = (user) => {
  if (!user.lastCompletedDate) {
    user.streak = 0;
    return;
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDate = new Date(user.lastCompletedDate);
  const lastCompleted = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

  const diffTime = Math.abs(today - lastCompleted);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    user.streak = 0;
  }
};

module.exports = {
  checkStreakAndBadgesMock,
  verifyStreakActiveMock
};
