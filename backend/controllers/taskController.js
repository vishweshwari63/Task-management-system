const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const { evaluateBadges } = require('../utils/badgeEvaluator');
const { checkStreakAndBadgesMock, verifyStreakActiveMock } = require('../utils/mockData');

// Initialize in-memory store
global.mockTasks = global.mockTasks || [];
global.mockUsers = global.mockUsers || [];

// Helper to verify if streak is still active, else resets it to 0
const verifyStreakActive = async (user) => {
  if (!user.lastCompletedDate) {
    if (user.streak !== 0) {
      user.streak = 0;
      await user.save();
    }
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
    await user.save();
  }
};

// Helper to update streak and achievements upon task completion
const checkStreakAndBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const completedCount = await Task.countDocuments({ userId, status: 'Completed' });
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
      user.lastCompletedDate = today;
    } else if (diffDays > 1) {
      user.streak = 1;
      user.lastCompletedDate = today;
    } else {
      user.lastCompletedDate = today;
    }
  } else {
    user.streak = 1;
    user.lastCompletedDate = today;
  }

  user.badges = evaluateBadges(completedCount, user.streak);
  await user.save();
};

// @desc    Get all user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy, page = 1, limit = 10, category } = req.query;

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const mockUser = global.mockUsers.find(u => u._id === req.user.id);
      if (mockUser) {
        verifyStreakActiveMock(mockUser);
      }

      let userTasks = global.mockTasks.filter(t => t.userId === req.user.id);

      // Filtering
      if (status) userTasks = userTasks.filter(t => t.status === status);
      if (priority) userTasks = userTasks.filter(t => t.priority === priority);
      if (category) userTasks = userTasks.filter(t => t.category === category);

      // Searching
      if (search) {
        const queryStr = search.toLowerCase();
        userTasks = userTasks.filter(t => t.title.toLowerCase().includes(queryStr));
      }

      // Sorting
      if (sortBy === 'Oldest') {
        userTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === 'Due Date') {
        userTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else {
        userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const total = userTasks.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedTasks = userTasks.slice(skip, skip + parseInt(limit));

      const allUserTasks = global.mockTasks.filter(t => t.userId === req.user.id);

      // Weekly productivity
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
        const count = allUserTasks.filter(t => {
          if (t.status !== 'Completed' || !t.dueDate) return false;
          const taskDate = new Date(t.dueDate);
          return taskDate.toDateString() === d.toDateString();
        }).length;
        last7Days.push({ date: dateStr, count });
      }

      return res.json({
        success: true,
        count: paginatedTasks.length,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        },
        data: paginatedTasks,
        analytics: {
          totalTasks: allUserTasks.length,
          completedTasks: allUserTasks.filter(t => t.status === 'Completed').length,
          pendingTasks: allUserTasks.filter(t => t.status === 'Pending').length,
          inProgressTasks: allUserTasks.filter(t => t.status === 'In Progress').length,
          weeklyProductivity: last7Days
        }
      });
    }

    const user = await User.findById(req.user.id);
    if (user) {
      await verifyStreakActive(user);
    }

    const query = { userId: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let sortOptions = {};
    if (sortBy === 'Oldest') {
      sortOptions.createdAt = 1;
    } else if (sortBy === 'Due Date') {
      sortOptions.dueDate = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const allUserTasks = await Task.find({ userId: req.user.id });
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      const count = allUserTasks.filter(t => {
        if (t.status !== 'Completed' || !t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        return taskDate.toDateString() === d.toDateString();
      }).length;
      last7Days.push({ date: dateStr, count });
    }

    res.json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: tasks,
      analytics: {
        totalTasks: allUserTasks.length,
        completedTasks: allUserTasks.filter(t => t.status === 'Completed').length,
        pendingTasks: allUserTasks.filter(t => t.status === 'Pending').length,
        inProgressTasks: allUserTasks.filter(t => t.status === 'In Progress').length,
        weeklyProductivity: last7Days
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const task = global.mockTasks.find(t => t._id === req.params.id && t.userId === req.user.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      return res.json({ success: true, data: task });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, category } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide title and due date' });
    }

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const mockId = new mongoose.Types.ObjectId().toString();
      const mockTask = {
        _id: mockId,
        title,
        description: description || '',
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate,
        category: category || 'Work',
        userId: req.user.id,
        createdAt: new Date().toISOString()
      };

      global.mockTasks.push(mockTask);

      if (status === 'Completed') {
        checkStreakAndBadgesMock(req.user.id);
      }

      return res.status(201).json({ success: true, data: mockTask });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      category,
      userId: req.user.id
    });

    if (status === 'Completed') {
      await checkStreakAndBadges(req.user.id);
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, category } = req.body;

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const task = global.mockTasks.find(t => t._id === req.params.id && t.userId === req.user.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const oldStatus = task.status;
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      task.category = category || task.category;

      if (status === 'Completed' && oldStatus !== 'Completed') {
        checkStreakAndBadgesMock(req.user.id);
      } else if (status && status !== 'Completed' && oldStatus === 'Completed') {
        const completedCount = global.mockTasks.filter(t => t.userId === req.user.id && t.status === 'Completed').length;
        const mockUser = global.mockUsers.find(u => u._id === req.user.id);
        if (mockUser) {
          mockUser.completedTasksCount = completedCount;
          mockUser.badges = evaluateBadges(completedCount, mockUser.streak);
        }
      }

      return res.json({ success: true, data: task });
    }

    let task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = task.status;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.category = category || task.category;

    const updatedTask = await task.save();

    if (status === 'Completed' && oldStatus !== 'Completed') {
      await checkStreakAndBadges(req.user.id);
    } else if (status && status !== 'Completed' && oldStatus === 'Completed') {
      const completedCount = await Task.countDocuments({ userId: req.user.id, status: 'Completed' });
      const user = await User.findById(req.user.id);
      if (user) {
        user.completedTasksCount = completedCount;
        user.badges = evaluateBadges(completedCount, user.streak);
        await user.save();
      }
    }

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const taskIndex = global.mockTasks.findIndex(t => t._id === req.params.id && t.userId === req.user.id);
      if (taskIndex === -1) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const task = global.mockTasks[taskIndex];
      global.mockTasks.splice(taskIndex, 1);

      if (task.status === 'Completed') {
        const completedCount = global.mockTasks.filter(t => t.userId === req.user.id && t.status === 'Completed').length;
        const mockUser = global.mockUsers.find(u => u._id === req.user.id);
        if (mockUser) {
          mockUser.completedTasksCount = completedCount;
          mockUser.badges = evaluateBadges(completedCount, mockUser.streak);
        }
      }

      return res.json({ success: true, message: 'Task removed' });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status === 'Completed') {
      const completedCount = await Task.countDocuments({ userId: req.user.id, status: 'Completed' });
      const user = await User.findById(req.user.id);
      if (user) {
        user.completedTasksCount = completedCount;
        user.badges = evaluateBadges(completedCount, user.streak);
        await user.save();
      }
    }

    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Patch task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please specify status' });
    }

    // In-memory Fallback
    if (mongoose.connection.readyState !== 1) {
      const task = global.mockTasks.find(t => t._id === req.params.id && t.userId === req.user.id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      const oldStatus = task.status;
      task.status = status;

      if (status === 'Completed' && oldStatus !== 'Completed') {
        checkStreakAndBadgesMock(req.user.id);
      } else if (oldStatus === 'Completed' && status !== 'Completed') {
        const completedCount = global.mockTasks.filter(t => t.userId === req.user.id && t.status === 'Completed').length;
        const mockUser = global.mockUsers.find(u => u._id === req.user.id);
        if (mockUser) {
          mockUser.completedTasksCount = completedCount;
          mockUser.badges = evaluateBadges(completedCount, mockUser.streak);
        }
      }

      return res.json({ success: true, data: task });
    }

    let task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    if (status === 'Completed' && oldStatus !== 'Completed') {
      await checkStreakAndBadges(req.user.id);
    } else if (oldStatus === 'Completed' && status !== 'Completed') {
      const completedCount = await Task.countDocuments({ userId: req.user.id, status: 'Completed' });
      const user = await User.findById(req.user.id);
      if (user) {
        user.completedTasksCount = completedCount;
        user.badges = evaluateBadges(completedCount, user.streak);
        await user.save();
      }
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus
};
