# PrepForge

> **Build skills. Forge confidence.**

PrepForge is a full-stack interview preparation platform designed for students and freshers to learn technical concepts, practice coding problems, prepare for interviews, and track their learning progress in one place.

## 🚀 Features

### 📚 Learning
- Browse learning categories and topics
- Structured lesson-based learning
- Track completed lessons
- User-specific learning progress

### 💻 Coding Practice
- Browse coding problems
- Filter problems by difficulty/topic
- Code editor with multiple language support
- Run code using Judge0
- Python, Java, and JavaScript support
- Track coding attempts and progress

### 🎯 Interview Preparation
- Technical interview questions
- Behavioral interview questions
- System Design questions
- Different difficulty levels
- Bookmark questions
- Save personal answers
- Track interview preparation progress

### 📊 Progress Tracking
- Learning progress
- Coding progress
- Interview preparation progress
- User-specific dashboard statistics

### 🔐 Authentication
- User registration and login
- Token-based authentication
- Protected routes
- Password reset functionality
- Password validation
- Login attempt protection using Django Axes

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide React
- CSS

### Backend
- Python
- Django
- Django REST Framework
- Token Authentication
- Django CORS Headers
- Django Axes

### Database
- MySQL
- SQLite

MySQL is used for content-related data, while SQLite is used for user/application data.

### Code Execution
- Judge0 API

## 🏗️ Project Structure

```text
PrepForge/
│
├── Prepforge-backend/
│   ├── accounts/
│   ├── coding/
│   ├── config/
│   ├── dashboard/
│   ├── interviews/
│   ├── learning/
│   ├── questions/
│   ├── manage.py
│   └── requirements.txt
│
├── prepforge-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md

⚙️ Installation
Prerequisites

Make sure you have:

Python 3.11+
Node.js
npm
MySQL 8+
Git
🔧 Backend Setup

Navigate to the backend:

cd Prepforge-backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Create a .env file in the backend directory and configure your database credentials:

MYSQL_DATABASE=prepforge_content
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
FRONTEND_URL=http://localhost:5173

Run migrations:

python manage.py migrate

Start the Django server:

python manage.py runserver

Backend:

http://127.0.0.1:8000
🎨 Frontend Setup

Open another terminal and navigate to the frontend:

cd prepforge-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:5173
🔄 Application Architecture
             ┌────────────────────┐
             │        React UI    │
             │      	Vite        │
             └───────── ┬─────────┘
                        │
                        │ REST API
                        ▼
             ┌─────────────────────┐
             │    Django REST API  │
             │        DRF          │
             └──────────┬──────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       ┌─────────────┐     ┌─────────────┐
       │    SQLite   │     │     MySQL   │
       │   User/Auth │     │    Content  │
       └─────────────┘     └─────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │   Judge0    │
                 │  Code Runner│
                 └─────────────┘
🔑 API Areas

The backend provides APIs for:

Authentication
Learning
Coding
Interviews
Dashboard
Progress tracking

The React frontend communicates with these APIs using Axios.

🔒 Security

The project includes:

Token-based API authentication
Password hashing through Django's authentication system
Django password validation
Protected frontend routes
Login attempt protection using Django Axes
Environment variables for sensitive configuration
User-specific progress and submission data

📌 Current Status

PrepForge is currently a development-stage full-stack project.

Core functionality includes:

Authentication
Learning modules
Coding practice
Code execution
Interview preparation
Progress tracking
Dashboard

🔮 Future Improvements

Possible future improvements include:

AI-powered mock interviews
AI-assisted interview feedback
Advanced coding evaluation with hidden test cases
Leaderboards
Personalized learning recommendations
Real email-based password reset
Production deployment
Automated testing and CI/CD
Advanced analytics

👨‍💻 Author

Swapnil Shetty

M.Tech in Computer Science & Engineering
BE in Artificial Intelligence & Machine Learning
