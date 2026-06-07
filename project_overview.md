# FocusHub ⚡ Project Overview
> **Productivity Engine & Gamified Task Management System**

FocusHub is a modern, production-ready full-stack MERN (MongoDB, Express.js, React.js, Node.js) SaaS task management application. It features a dark-themed glassmorphic design, natural language parsing, gamified user statistics (streaks & badges), and custom data visualization.

---

## 🚀 Key System Features

### 1. AI-Driven Smart Task Creator
Allows users to naturally type a phrase to create a task. An extraction engine parses the input text:
*   **Prompt Example:** *"Deploy marketing campaign next Friday as high priority"*
*   **Result:** Extracts title (*"Deploy marketing campaign"*), due date (*Next Friday*), and priority (*High*).

### 2. Gamified Streaks & Badges
*   **Daily Streaks:** Tracks consecutive days on which the user completes tasks, displayed in a custom weekly calendar tracker.
*   **Achievement Badges:**
    *   🏅 **First Task:** 1st completed task.
    *   🔥 **7 Day Streak:** Keep the flame burning for 7 days.
    *   ⚡ **50 Tasks Completed:** Total completions reach 50.
    *   👑 **Productivity Master:** 20+ completions and a 5+ day streak.

### 3. Trello-Style Kanban Board
Interactive task tracking with status categories: `Pending`, `In Progress`, and `Completed`. Supports quick changes, status updates, and detail modals.

### 4. Interactive Data Visualization
Embedded analytics widgets built with **Recharts**:
*   **Productivity Engine:** Circular progress indicator displaying the user's ratio of completed tasks to total tasks.
*   **Weekly Trends:** Area chart showing completion history over the last 7 days.
*   **Priority Distribution:** Bar chart grouping tasks by high, medium, and low priority levels.

### 5. Advanced Search, Filters & Export
*   Debounced live text search on task titles.
*   Select dropdown filters for Priority, Status, and sorting options (Latest, Oldest, Due Date).
*   **CSV Exporter:** Compile current task view into a downloadable `.csv` file.

---

## 🛠️ Technical Architecture

### Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS (v4), Framer Motion, Axios, React Icons, Recharts, React Toastify.
*   **Backend:** Node.js, Express.js, JSON Web Tokens (JWT) for authentication, bcryptjs.
*   **Database:** MongoDB via Mongoose OR **In-Memory Fallback Store**.

### Resilient Database Fallback Design
If a MongoDB connection is unavailable (e.g. running offline or local port 27017 is closed), the application **automatically activates In-Memory Mode**. 
*   Uses a global state-management mockup server-side (`global.mockUsers` and `global.mockTasks`).
*   Mock controllers mimic user authentication, hashing, tasks CRUD, status patching, streaks, and achievement evaluation.
*   No database setup is required to run and test the complete app locally.

---

## 📂 Project Structure

```bash
TASK/
├── backend/
│   ├── config/          # DB connection configuration
│   ├── controllers/     # Route logic (auth, tasks)
│   ├── middleware/      # JWT route protection middleware
│   ├── models/          # Mongoose models (User, Task)
│   ├── routes/          # REST endpoints
│   ├── utils/           # Streak checks & badge evaluators
│   └── server.js        # Express server entrypoint
│
└── frontend/
    ├── src/
    │   ├── components/  # Kanban, charts, inputs, modals
    │   ├── context/     # Global AuthContext provider
    │   ├── pages/       # Login, Register, Dashboard, Profile
    │   ├── services/    # Axios API client
    │   └── index.css    # Tailwind configuration & global utilities
    ├── index.html       # Landing setup & SEO tags
    └── vite.config.js
```

---

## 🔑 Database Schemas

### 👤 User Schema
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  streak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date, default: null },
  completedTasksCount: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  avatar: { type: String, default: 'gradient-1' }
}
```

### 📋 Task Schema
```javascript
{
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date, required: true },
  category: { type: String, default: 'Work' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}
```
