Tech Forum
By Emmanuel Etta

A full-stack forum application following 3-tier architecture with theme: Programming Languages Discussion

Architecture Overview
3-Tier Architecture Diagram

1. Data Layer (MongoDB)
Database Schema:

javascript
// Users Collection
{
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  joinedAt: Date
}

// Questions Collection
{
  title: String,
  content: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [{
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
  }],
  createdAt: Date
}

// Categories Collection
{
  name: { type: String, unique: true },
  description: String
}
Database Service:

MongoDB Atlas (Cloud-based)

Mongoose ODM

Sample data seeding script included

2. Application Layer (Node.js/Express)
API Endpoints:

markdown
## Authentication
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout

## Categories
GET /api/categories         - List all categories
POST /api/categories        - Create new category (admin)

## Questions
GET /api/questions          - Get questions by category
POST /api/questions         - Create new question
PUT /api/questions/:id      - Update question
DELETE /api/questions/:id   - Delete question

## Answers
POST /api/answers           - Add answer to question
PUT /api/answers/:id        - Edit answer
DELETE /api/answers/:id     - Delete answer
Key Features:

JWT Authentication

Role-based access control

Request validation middleware

Error handling middleware

Rate limiting for API endpoints

CORS configuration

3. Presentation Layer (React)
Client Structure:

src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── Dashboard/
│   │   ├── CategoryMenu.js
│   │   └── QuestionList.js
│   ├── Forum/
│   │   ├── QuestionDetail.js
│   │   └── AnswerForm.js
│   └── Navigation.js
├── context/
│   └── AuthContext.js
├── services/
│   └── api.js
└── styles/
    └── main.scss
Implemented Features:

User Authentication Flow

JWT token storage in HTTP-only cookies

Protected routes using React Router

Form validation with Formik+Yup

Question Management

Rich text editor for question input

Nested comments system

Category filtering

UI Components

Responsive layout using React Bootstrap

Loading states and error boundaries

Real-time updates with WebSocket

Tech Stack:

React 18 + React Router 6

Redux Toolkit for state management

Axios for API communication

SCSS for styling

React Quill rich text editor

Deployment
Backend:

Hosted on Render.com

Environment: Node.js 18.x

Database: MongoDB Atlas Cluster

Frontend:

Hosted on Netlify

Continuous Deployment from GitHub

HTTPS enforced

Future Improvements
Implement real-time notifications

Add question voting system

Introduce user reputation points

Add search functionality with ElasticSearch

Implement file uploads for code snippets

Add admin dashboard

Enable social media login
