# PrepIt 🎯

An AI-powered mock interview platform that helps you practice technical interviews with real-time feedback, scoring, and progress tracking.

---

## What It Does

Paste a job posting → PrepIt parses the role and required skills → An AI interviewer asks you targeted technical questions → Get scored and receive detailed feedback after every answer.

---

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Interview in Action
![Interview](./screenshots/interview.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| State | TanStack Query + Context API |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| AI | Anthropic Claude API |
| Auth | JWT + bcrypt |
| Streaming | Server-Sent Events (SSE) |

---

## Features

- **AI Job Parser** — paste any job posting, Claude extracts job title, company, required and preferred skills automatically
- **Streaming Interview** — responses stream token by token like ChatGPT for a natural interview feel
- **Structured Scoring** — every answer is scored 1-10 with detailed feedback on what you did well and where to improve
- **Session History** — all conversations are persisted so you can review past interviews
- **Protected Routes** — JWT auth guards all interview sessions
- **Real-time UI** — live streaming chat with auto-scroll and typing indicators

---

## Project Structure

```
Prepit/
├── client/                   # React frontend
│   └── src/
│       ├── api/
│       │   └── axios.ts      # axios instance with auth interceptor
│       ├── components/
│       │   ├── ChatInput.tsx
│       │   ├── MessageBubble.tsx
│       │   ├── CreateSession.tsx
│       │   └── SessionsList.tsx
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── guards/
│       │   └── ProtectedRoute.tsx
│       ├── hooks/
│       │   └── useInterview.ts
│       ├── layouts/
│       │   ├── MainLayout.tsx
│       │   └── DashboardLayout.tsx
│       └── pages/
│           ├── Home.tsx
│           ├── Login.tsx
│           ├── Register.tsx
│           ├── Dashboard.tsx
│           └── Interview.tsx
│
└── backend/                  # Express backend
    └── src/
        ├── config/
        │   └── db.js
        ├── controllers/
        │   ├── authController.js
        │   ├── sessionController.js
        │   └── interviewController.js
        ├── middleware/
        │   └── authMiddleware.js
        ├── models/
        │   ├── User.js
        │   ├── Session.js
        │   └── Conversation.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── sessionRoutes.js
        │   └── interviewRoutes.js
        └── services/
            └── aiService.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/Gursimran07316/Prepit
cd prepit
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5003
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

Start the server:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

### 4. Open the app

```
http://localhost:5173
```

---

## How It Works

### Auth Flow
```
Register / Login → JWT token issued → stored in localStorage
→ attached to every request via axios interceptor
→ protected routes check token via middleware
```

### Interview Flow
```
Paste job posting → Claude extracts skills → Session created in MongoDB
→ User sends message → saved to Conversation collection
→ Claude streams response via SSE → chunks appear in real time
→ Full response saved with score + feedback → history loads on next visit
```

---

## API Endpoints

### Auth
```
POST /api/auth/register    — create account
POST /api/auth/login       — login, returns JWT
GET  /api/auth/profile     — get current user (protected)
```

### Sessions
```
POST /api/sessions/create           — create session from job posting
GET  /api/sessions/get              — get all sessions for user
GET  /api/sessions/:id              — get session by id
GET  /api/sessions/:id/conversations — get conversation history
```

### Interview
```
POST /api/interview/respond   — send message, stream Claude response
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend port (default 5003) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |

---


## License

MIT
