# FocusHub ⚡
> "Organize Work. Track Progress. Stay Focused."

FocusHub is a production-ready, feature-rich MERN Stack application designed as a premium task management SaaS platform. It combines clean aesthetics inspired by Linear, Notion, and Stripe with advanced productivity gamification.

DEPLOY LINK:https://task-management-system-ten-sage.vercel.app/

## 🚀 Key Features

*   **Premium Dark Modern UI/UX:** Responsive, glassmorphic layout styled with Tailwind CSS, animated with Framer Motion, and equipped with a dark/light mode toggle.
*   **AI Smart Task Creator:** An intelligent natural language parsing bar that extracts the task title, priority level, and due date from phrases like *"Launch website next Monday as high priority"*.
*   **Trello-Inspired Kanban Board:** Visual drag-and-drop or touch-friendly board columns (Pending, In Progress, Completed) to track work stages.
*   **Daily Productivity Streak:** Tracks Consecutive Days Completed and rewards users with dynamic badges.
*   **Achievement Badges:**
    *   🏅 *First Task* (1st completed task)
    *   🔥 *7 Day Streak* (Active daily streak >= 7)
    *   ⚡ *50 Tasks Completed* (Total completed >= 50)
    *   👑 *Productivity Master* (Total completed >= 20 and streak >= 5)
*   **Advanced Data Visualization:** Powered by Recharts. Includes:
    *   Pie Chart: Completed vs. Pending vs. In Progress status count.
    *   Bar Chart: Priority distribution (High, Medium, Low).
    *   Area Chart: Weekly productivity history.
*   **Filters, Search, and Sort:** Live debounced search by title, filters by status and priority, and sorting options (Latest, Oldest, Due Date).
*   **CSV Task Export:** Fast, client-side generation and downloading of task records in CSV format.
*   **Persistent Auth:** Secure JWT login/registration with password hashing and persistent login sessions.

---

## 🛠️ Tech Stack

### Frontend
- **Core:** React.js (Vite)
- **Routing:** React Router DOM (v6)
- **Styling:** Tailwind CSS (v4) & Framer Motion
- **HTTP Client:** Axios
- **Alerts:** React Toastify
- **Charts:** Recharts
- **Icons:** React Icons

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JSON Web Tokens (JWT) & bcryptjs
- **Middleware:** CORS, Express JSON parser, Dotenv

---

## 📂 Project Structure

```bash
TASK/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic handlers (auth, tasks)
│   ├── middleware/      # JWT route protection guards
│   ├── models/          # Mongoose database models (User, Task)
│   ├── routes/          # API route definitions (auth, tasks)
│   ├── utils/           # Helper scripts (badgeEvaluator)
│   ├── .env             # Environment configs
│   └── server.js        # Server entry script
│
└── frontend/
    ├── public/          # Assets and icons
    ├── src/
    │   ├── components/  # Reusable UI widgets
    │   ├── context/     # AuthContext state store
    │   ├── pages/       # Route pages (Dashboard, Login, Register, Profile)
    │   ├── services/    # Axios client middleware
    │   ├── App.jsx      # Main router config
    │   ├── index.css    # Tailwind styling & glass styles
    │   └── main.jsx     # App DOM mounting
    ├── index.html       # HTML head tags & SEO
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB installed locally OR a MongoDB Atlas cloud account

### Step 1: Clone or Open the Project
Open the project root directory:
```bash
cd TASK
```

### Step 2: Configure the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory (already created locally) and define the following environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/focushub
   JWT_SECRET=focushub_super_secret_key_12345
   NODE_ENV=development
   ```
4. Start the backend:
   ```bash
   npm run start   # or node server.js
   ```

### Step 3: Configure the Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🔑 Environment Variables

| Variable | Location | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port number the backend server runs on | `5000` |
| `MONGO_URI` | Backend | Connection string to MongoDB database | `mongodb://127.0.0.1:27017/focushub` |
| `JWT_SECRET` | Backend | Salt secret to encode JSON Web Tokens | `focushub_super_secret_key_12345` |
| `NODE_ENV` | Backend | Environment flag | `development` |
| `VITE_API_URL` | Frontend | API URL endpoint for database requests | `http://localhost:5000/api` |

---

## 📡 Backend API Endpoints

### Authentication `/api/auth`
*   `POST /register` - Register a new account.
*   `POST /login` - Login to account.
*   `GET /profile` - Retrieve current user profile (Requires Bearer Token).
*   `PUT /profile` - Update current user profile details (Requires Bearer Token).

### Tasks `/api/tasks`
*(All task endpoints require a valid JWT Bearer Token)*
*   `GET /` - Retrieve all user tasks (Supports query search, status/priority filtering, sorting, and pagination).
*   `GET /:id` - Retrieve a task details by ID.
*   `POST /` - Create a new task.
*   `PUT /:id` - Update an existing task details.
*   `PATCH /:id/status` - Quick patch task status (updates daily streaks and badges).
*   `DELETE /:id` - Remove a task.

---

## 🌐 Deployment Ready Guide

### Vercel (Frontend React)
1. Add a `vercel.json` configuration file in the `frontend/` folder:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
2. Link your repository on Vercel, select the `frontend/` directory as root, and set the environment variable:
   `VITE_API_URL = https://your-render-backend-url.onrender.com/api`

### Render (Backend Express Node)
1. Create a Web Service on Render, link the repository, and set the Root Directory to `backend/`.
2. Configure Start Command: `npm install && node server.js`.
3. Set the Environment Variables:
   *   `MONGO_URI = mongodb+srv://<user>:<pass>@yourcluster.mongodb.net/focushub`
   *   `JWT_SECRET = your_production_jwt_secret`
   *   `NODE_ENV = production`
   *   `PORT = 10000` (handled by Render)
