# LowKeyDesign

> **Practice Low-Level Design visually. Build it. Submit it. Get evaluated. Improve it.**

LowKeyDesign is an interactive **Low-Level Design (LLD) practice platform** that helps developers learn and practice object-oriented design through visual UML class diagrams.

Learners can select an LLD problem, visually design their solution using classes and UML relationships, submit the design, and receive structured rubric-based feedback powered by AI.

---

## 🚀 Features

- 🔐 User registration and JWT authentication
- 📚 Browse LLD practice problems
- 🧩 Interactive UML / LLD editor
- 🏗️ Create:
  - Classes
  - Abstract Classes
  - Interfaces
  - Enums
  - Attributes
  - Methods
  - Method parameters
- 🔗 Create UML relationships:
  - Inheritance
  - Implementation
  - Association
  - Aggregation
  - Composition
  - Dependency
- 💾 Save designs locally while practicing
- 📤 Submit designs for evaluation
- ✅ Deterministic design validation
- 🤖 AI-powered LLD evaluation using OpenRouter
- 📊 Rubric-based scoring
- 📝 Evidence-based feedback
- 🔄 Retry failed AI evaluations without losing the original design
- 📖 View previous attempts and reports

---

## 🧠 How It Works

Choose Problem
      ↓
Build UML Design
      ↓
Submit Design
      ↓
Deterministic Checks
      ↓
AI Evaluation
      ↓
Rubric-Based Score
      ↓
Feedback Report
      ↓
Improve & Retry

The platform intentionally separates objective validation from AI-based design judgment.

For example:

Deterministic Checks
├── Is the design empty?
├── Duplicate class names?
├── Number of classes?
├── Number of interfaces?
├── Invalid relationships?
└── Missing names?

AI Evaluation
├── Are responsibilities well distributed?
├── Is coupling reasonable?
├── Is abstraction appropriate?
├── Is the design extensible?
└── Are edge cases handled?

🛠️ Tech Stack
Frontend

    React

    Vite

    React Router

    React Flow (@xyflow/react)

    Context API

    localStorage

Backend

    Node.js

    Express.js

    MongoDB

    Mongoose

    JWT

    bcryptjs

    OpenRouter API

🏗️ Architecture

┌─────────────────────────────┐
│        React Frontend       │
│                             │
│  Dashboard                  │
│  Problems                   │
│  UML Editor                 │
│  Submission                 │
│  Attempts / Reports        │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       Node + Express        │
│                             │
│  Authentication             │
│  Submission Management     │
│  Deterministic Checks       │
│  AI Evaluation Service      │
└──────────┬───────────┬──────┘
           │           │
           ▼           ▼
┌────────────────┐  ┌─────────────────┐
│    MongoDB     │  │   OpenRouter    │
│                │  │                 │
│ Users          │  │ Free LLM Model  │
│ Submissions    │  │ AI Evaluation   │
│ Evaluations    │  └─────────────────┘
└────────────────┘

🧩 UML Editor

The UML editor is built using React Flow.

Learners can visually construct LLD designs using different UML elements.
Supported Nodes

Class
Abstract Class
Interface
Enum

Class Members

Attributes
Methods
Parameters
Return Types
Visibility

Supported Relationships

Inheritance
Implementation
Association
Aggregation
Composition
Dependency

The editor stores the diagram as structured JSON containing React Flow nodes and edges. This representation is sent to the backend for validation and evaluation.
🤖 AI Evaluation

LowKeyDesign uses OpenRouter to evaluate submitted LLD designs.

The AI evaluates designs against a fixed rubric rather than requiring the learner to reproduce one specific reference solution.

This allows multiple valid designs to receive good scores.
Evaluation Flow

React
  ↓
POST /submissions
  ↓
Save Submission
  ↓
Run Deterministic Checks
  ↓
OpenRouter
  ↓
Structured JSON Evaluation
  ↓
Backend Validation
  ↓
Save Evaluation
  ↓
Display Report

AI feedback includes:

    Overall score

    Individual criterion scores

    Evidence from the submitted design

    Concerns

    Suggestions

    Confidence

    Overall strengths

📊 Evaluation Rubric
Criterion	Weight
Requirement Understanding	15%
Class Responsibilities	20%
Encapsulation	10%
Coupling & Cohesion	15%
Abstraction	10%
Extensibility	10%
Design Patterns	5%
Edge Cases	5%
Explanation Quality	10%
Total	100%

The evaluator is instructed to:

    Accept multiple valid LLD solutions

    Avoid forcing a single reference architecture

    Use evidence from the submitted design

    Never invent classes or relationships that do not exist

    Avoid unnecessary design patterns

    Provide actionable feedback for learners

🔄 Submission Lifecycle

Each submission follows this lifecycle:

submitted
    ↓
evaluating
    ↓
completed

If the AI evaluation fails:

submitted
    ↓
evaluating
    ↓
failed

The original design is preserved even if the AI evaluation fails.

The learner can then use:

Retry Evaluation

without having to recreate the design.
📚 Current Problems

The platform currently includes beginner-friendly LLD problems such as:

    🚗 Parking Lot

    📚 Library Management System

    ❌ Tic Tac Toe

    🏧 ATM

    ☕ Coffee Machine

📁 Project Structure

LowKeyDesign/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── data/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── Frontend/
    └── frontend/
        ├── src/
        │   ├── api/
        │   ├── components/
        │   ├── context/
        │   ├── data/
        │   ├── pages/
        │   └── App.jsx
        ├── .env
        ├── package.json
        └── vite.config.js

⚙️ Setup
Prerequisites

    Node.js 18+

    npm

    MongoDB Atlas or local MongoDB

    OpenRouter account and API key

1. Clone / Open the Project

git clone <repository-url>
cd LowKeyDesign

2. Backend Setup

cd Backend
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_long_random_secret
OPENROUTER_API_KEY=your_openrouter_api_key

Important

Never commit .env to Git.

Add:

.env

If your MongoDB password contains special characters such as @, URL-encode them.

Example:

@ → %40

The OpenRouter API key must remain on the backend and must never be exposed to the React frontend.
3. Frontend Setup

cd ../Frontend/frontend
npm install

Create/update .env:

VITE_API_URL=http://localhost:5000/api

▶️ Run the Application

Open two terminals.
Terminal 1 — Backend

cd Backend
node server.js

Expected output:

MongoDB Connected: ...
Server running on port 5000

Terminal 2 — Frontend

cd Frontend/frontend
npm run dev

Open the Vite URL shown in the terminal.

Usually:

http://localhost:5173

🧭 User Flow

Register / Login
      ↓
Problems Dashboard
      ↓
Select Problem
      ↓
Start Practice
      ↓
Build UML Design
      ↓
Submit Design
      ↓
Evaluation
      ↓
View Score & Feedback
      ↓
My Attempts
      ↓
Review Previous Design
      ↓
Try Again

🔌 API Endpoints

Base URL:

http://localhost:5000/api

Authentication
Register

POST /auth/register

Login

POST /auth/login

Current User

GET /auth/me

Requires:

Authorization: Bearer <JWT>

Submissions
Create Submission

POST /submissions

Requires JWT.

Creates and stores a new LLD submission and starts the evaluation process.
Get User Attempts

GET /submissions

Requires JWT.

Returns the authenticated user's previous submissions.
Get Submission

GET /submissions/:id

Requires JWT.

Returns submission status and evaluation results.
Retry Evaluation

POST /submissions/:id/retry

Requires JWT.

Retries AI evaluation while preserving the original design.
Health Check

GET /health

Example:

{
  "status": "ok"
}

💾 Data Models
User

User
├── name
├── email
└── password

Passwords are hashed using bcryptjs.
Submission

Submission
├── user
├── problemId
├── design
├── status
├── createdAt
└── updatedAt

The design field contains the structured UML editor state.
Evaluation

Evaluation
├── submission
├── overallScore
├── criteria[]
├── strengths[]
├── concerns[]
├── suggestions[]
├── createdAt
└── updatedAt

🔐 Security

The application currently implements:

    JWT authentication

    Password hashing using bcrypt

    Protected API routes

    User ownership checks

    Environment variables for secrets

    Server-side OpenRouter API key

    No AI API keys exposed to the browser

🧠 Engineering Decisions
Why React Flow?

LLD diagrams are naturally represented as graphs:

Nodes → Classes / Interfaces / Enums
Edges → Relationships

React Flow provides the required graph editing capabilities including:

    Node positioning

    Connections

    Zooming

    Panning

    Edge management

    Structured graph state

Why Deterministic Checks + AI?

Not every evaluation criterion requires an LLM.

Objective checks are handled using traditional backend logic, while subjective design decisions are evaluated using AI.

Traditional Code
       ↓
Objective Validation

AI
       ↓
Design Reasoning

This reduces unnecessary AI usage and makes the evaluation system more predictable.
Why Structured AI Output?

The evaluator returns structured JSON instead of free-form text.

This allows the application to reliably display:

Overall Score
     ↓
Rubric Scores
     ↓
Evidence
     ↓
Concerns
     ↓
Suggestions

The backend also validates the AI response before saving it.
💡 Future Improvements

The current MVP focuses on the core learning loop:

    Practice → Design → Submit → Evaluate → Learn → Retry

Potential future improvements include:

    Design pattern suggestions

    Class role classification

    More LLD problems

    Difficulty levels

    UML diagram export

    Code generation from UML

    Leaderboards

    Community solutions

    Instructor-created problems

    Evaluation analytics

    Redis-based rate limiting and caching

    Kafka-based asynchronous AI evaluation workers

    Background evaluation queues

Redis and Kafka are intentionally kept as future infrastructure improvements rather than adding unnecessary complexity to the MVP.
🐛 Common Issues
ENOENT: package.json

Make sure frontend commands are executed from:

cd Frontend/frontend

MongoDB bad auth

Check:

    MongoDB username

    MongoDB password

    MONGO_URI

    MongoDB Atlas Network Access

    URL encoding of special characters

Evaluation Failed / Malformed JSON

Check:

OPENROUTER_API_KEY=your_api_key

Restart the backend after changing .env:

node server.js

Then use:

Retry Evaluation

Free models may occasionally be unavailable or rate-limited.

The submitted design remains saved even if evaluation fails.
Authentication Redirects to Login

Check:

VITE_API_URL=http://localhost:5000/api

Restart the Vite development server after changing .env.
📦 Scripts
Backend

node server.js

Frontend

Development:

npm run dev

Production build:

npm run build

Preview:

npm run preview

🔑 Environment Variables
Backend

MONGO_URI=
PORT=5000
JWT_SECRET=
OPENROUTER_API_KEY=

Frontend

VITE_API_URL=http://localhost:5000/api

Never commit real credentials or API keys.
📌 MVP Philosophy

LowKeyDesign focuses on solving one core problem:

    How can an LLD learner practice designs and receive meaningful feedback without needing to manually compare their solution against a reference answer?

The MVP keeps the experience focused:

Problem
   ↓
Visual Design
   ↓
Submission
   ↓
Evaluation
   ↓
Feedback
   ↓
Improvement
