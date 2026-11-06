#VertexLearnAI — AI-Powered Learning Management System

<div align="center">

![VertexLearnAI Logo](https://img.shields.io/badge/VertexLearnAI-LMS-6c63ff?style=for-the-badge&logo=graduation-cap&logoColor=white)

**A full-stack AI-powered Learning Management System built with the MERN stack**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-6c63ff?style=for-the-badge)](https://vetexlearnai-1-cxg7.onrender.com)
[![Backend API](https://img.shields.io/badge/API-Backend-27ae60?style=for-the-badge)](https://vertexlearnai-bgfe-yti0.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-1a1a2e?style=for-the-badge&logo=github)](https://github.com/Amaidk7/VertexLearnAI)
[![Demo Video](https://img.shields.io/badge/Demo-Video-e74c3c?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1FShgEf85TSRdXcklEZBu2pBCNmI-aLzh/view?usp=sharing)

</div>

---

## 📖 About VertexLearnAI

VertexLearnAI is a production-grade **Learning Management System** that bridges the gap between educators and students. Educators can create, publish, and manage video courses. Students can discover, purchase, and consume those courses — with AI-powered learning tools built right in.

Built completely from scratch using the **MERN stack**, VertexLearnAI features custom JWT authentication, Razorpay payment integration, Google Gemini AI for 5 AI features, Cloudinary for media storage, PDFKit for certificate generation, and a complete dark/light theme system.

---


---

## ✨ Features Overview

### 🔐 Authentication System
- **Email/Password signup** with bcrypt password hashing (10 salt rounds)
- **Role-based accounts** — Student or Educator selected at signup
- **JWT authentication** stored in HttpOnly cookies (7-day expiry)
- **Google OAuth** via Firebase — one-click Google sign-in
- **OTP-based password reset** — 6-digit OTP sent via email, 5-minute expiry
- **Secure logout** — cookie cleared server-side

### 👨‍🏫 Educator Features
- **Create courses** with title, subtitle, description, category, level, price
- **Upload course thumbnail** — stored on Cloudinary with CDN delivery
- **Add video lectures** — videos uploaded to Cloudinary, stored as URLs
- **Free preview lectures** — mark specific lectures as preview-free
- **Publish/Unpublish courses** — control course visibility
- **Edit course details** anytime
- **Delete courses and lectures**
- **Educator Dashboard** — view all created courses with stats
- **View enrolled students** count per course

### 🎓 Student Features
- **Browse all published courses** with search and filters
- **View course details** — description, lectures list, instructor info, reviews
- **Watch free preview lectures** without enrollment
- **Purchase courses** via Razorpay payment gateway (UPI, cards, net banking)
- **Access full course content** after enrollment
- **Mark lectures as complete** — per-lecture progress tracking
- **Progress bar** — visual percentage of course completion
- **Download completion certificate** — PDF generated on course completion
- **My Enrolled Courses** — dedicated page for all purchased courses
- **Student Dashboard** — progress visualization with Recharts bar chart
- **Wishlist** — save courses for later, toggle in/out
- **Continue Watching** — resume from where you left off

### 🤖 AI Features (Google Gemini 2.5 Flash)

#### 1. AI Doubt Solver
- Floating chat widget on every lecture page
- Multi-turn conversation with chat history context
- Course and lecture context injected into every prompt
- Last 6 messages sent as context window
- Gemini answers in simple, student-friendly language

#### 2. AI Quiz Generator
- Generate a 5-question MCQ quiz for any course
- Questions tailored to course title, category, and difficulty level
- 4 options per question with correct answer and explanation
- Color-coded results — green (4-5/5), orange (3/5), red (0-2/5)
- Shows correct/wrong answers after submission

#### 3. AI Learning Roadmap Generator
- Enter your learning goal, experience level, and available time
- Gemini fetches real courses from the database
- Generates a multi-phase personalized learning plan
- Each phase includes recommended VertexLearnAI courses with direct links
- Structured timeline with milestones

#### 4. AI Smart Notes Generator
- Generate comprehensive study notes for any lecture
- Returns structured output: Summary, Key Points, Important Terms, Practice Questions, Quick Tips
- One-click generation from the lecture player page

#### 5. AI Smart Recommendations
- Analyzes your enrolled course history
- Gemini compares your profile against unenrolled courses
- Returns top 4 personalized course recommendations
- Enriched with full course data and direct enrollment links

#### 6. AI-Enhanced Search
- Two-stage search: direct regex match first (fast path)
- If no results: Gemini extracts the most relevant keyword from 11 fixed categories
- Falls back to category-based search with AI keyword
- Supports voice input via Web Speech API
- Text-to-speech reads results aloud

### 💳 Payment System (Razorpay)
- Create Razorpay order from course price
- Open Razorpay checkout modal (UPI, cards, net banking, wallets)
- Server-side payment verification via Razorpay API
- Automatic enrollment after successful payment
- Course added to student's enrolled list
- Student added to course's enrolled students list

### 📜 Certificate Generation (PDFKit)
- PDF certificate generated server-side using PDFKit
- Streamed directly to HTTP response — no temp file saved
- A4 landscape format with decorative borders and design
- Includes student name, course title, instructor name, completion date
- Unique certificate ID: `EV-{courseId last 6}-{userId last 6}`
- Download triggered by browser automatically

### ⭐ Reviews & Ratings
- Enrolled students can leave a review with 1-5 star rating
- One review per student per course
- Reviews displayed on course detail page
- Average rating calculated and displayed

### ❤️ Wishlist System
- Add/remove courses from wishlist with toggle
- Dedicated wishlist page
- Average rating shown per wishlisted course
- Direct enrollment from wishlist

### 🌙 Dark / Light Theme
- Full dark/light mode toggle
- CSS custom properties (`--bg-primary`, `--accent`, etc.)
- `data-theme` attribute on `<html>` element
- Persisted in `localStorage` across sessions
- All components respect the theme

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI library |
| Vite | 7.x | Build tool + HMR |
| Redux Toolkit | 2.11.2 | Global state management |
| React Router DOM | 7.13.1 | Client-side routing |
| Tailwind CSS | 4.2.1 | Utility-first CSS framework |
| Axios | 1.13.6 | HTTP client |
| Firebase | 12.10.0 | Google OAuth |
| Recharts | 3.8.0 | Progress charts |
| React Toastify | 11.0.5 | Toast notifications |
| React Spinners | 0.17.0 | Loading indicators |
| React Icons | 5.5.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express | 5.2.1 | Web framework |
| MongoDB | Atlas | NoSQL database |
| Mongoose | 9.2.4 | ODM |
| JSON Web Token | 9.0.3 | Authentication tokens |
| bcryptjs | 3.0.3 | Password hashing |
| Cloudinary | 2.9.0 | Media storage (images + videos) |
| Multer | 2.1.1 | File upload middleware |
| Razorpay | 2.9.6 | Payment gateway |
| @google/genai | 1.44.0 | Google Gemini AI SDK |
| Nodemailer | 8.0.1 | Email (OTP) sending |
| PDFKit | 0.18.0 | PDF certificate generation |
| validator | 13.15.26 | Input validation |
| dotenv | 17.3.1 | Environment variables |
| nodemon | 3.1.14 | Development server |

### Deployment
| Service | Purpose |
|---------|---------|
| Render.com | Frontend + Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Media CDN |

---

## 📁 Project Structure

```
VertexLearnAI/
│
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── connectDB.js        # MongoDB Atlas connection
│   │   ├── token.js            # JWT token generation (7d expiry)
│   │   ├── cloudinary.js       # Cloudinary upload + local file delete
│   │   └── sendMail.js         # Nodemailer Gmail SMTP transporter
│   │
│   ├── controller/
│   │   ├── authController.js   # signUp, login, logOut, sendOTP, verifyOTP, resetPassword, googleAuth
│   │   ├── courseController.js # CRUD courses + lectures + search
│   │   ├── userController.js   # getCurrentUser, updateProfile, markLectureComplete, getProgress
│   │   ├── orderController.js  # RazorpayOrder, verifyPayment + enrollment
│   │   ├── reviewController.js # createReview, getReviews
│   │   ├── featuresController.js # Progress, Certificate (PDF), Wishlist
│   │   ├── aiController.js     # 5 Gemini AI features
│   │   └── searchController.js # AI-enhanced two-stage search
│   │
│   ├── middleware/
│   │   ├── isAuth.js           # JWT cookie verification → req.userId
│   │   └── multer.js           # Disk storage to ./public folder
│   │
│   ├── model/
│   │   ├── userModel.js        # User schema with embedded courseProgress
│   │   ├── courseModel.js      # Course schema with lectures[], reviews[], enrolledStudents[]
│   │   ├── lectureModel.js     # Lecture schema with videoUrl, isPreviewFree
│   │   ├── progressModel.js    # Standalone progress with compound unique index
│   │   ├── reviewModel.js      # Review with rating (1-5) and comment
│   │   └── wishlistModel.js    # Wishlist with unique index on user
│   │
│   ├── route/
│   │   ├── authRoute.js        # /api/auth/*
│   │   ├── userRoute.js        # /api/user/*
│   │   ├── courseRoute.js      # /api/course/*
│   │   ├── paymentRoute.js     # /api/order/*
│   │   ├── reviewRoute.js      # /api/review/*
│   │   ├── aiRoute.js          # /api/ai/*
│   │   └── featuresRoute.js    # /api/features/*
│   │
│   ├── public/                 # Temp upload folder (.gitkeep)
│   ├── index.js                # Entry point — CORS, middleware, routes, server
│   └── package.json
│
└── frontend/                   # React 19 SPA
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx              # Landing page
    │   │   ├── Login.jsx             # Login form
    │   │   ├── SignUp.jsx            # Signup with role selection
    │   │   ├── ForgetPassword.jsx    # 3-step OTP password reset
    │   │   ├── AllCourses.jsx        # Browse all published courses
    │   │   ├── ViewCourse.jsx        # Course detail + enroll + review
    │   │   ├── ViewLectures.jsx      # Video player + AI tools + progress
    │   │   ├── MyEnrolledCourses.jsx # Student's purchased courses
    │   │   ├── StudentDashboard.jsx  # Progress charts (Recharts)
    │   │   ├── Profile.jsx           # User profile
    │   │   ├── EditProfile.jsx       # Edit name, photo, description
    │   │   ├── SearchWithAi.jsx      # AI + voice search
    │   │   ├── RoadmapPage.jsx       # AI learning roadmap
    │   │   ├── QuizPage.jsx          # AI quiz with scoring
    │   │   ├── NotesPage.jsx         # AI study notes
    │   │   ├── WishlistPage.jsx      # Saved courses
    │   │   └── Educator/
    │   │       ├── Dashboard.jsx     # Educator overview
    │   │       ├── Courses.jsx       # Manage courses list
    │   │       ├── CreateCourses.jsx # Create new course
    │   │       ├── EditCourse.jsx    # Edit existing course
    │   │       ├── CreateLecture.jsx # Add lecture to course
    │   │       └── EditLecture.jsx   # Edit lecture + video
    │   │
    │   ├── component/
    │   │   ├── Nav.jsx               # Navbar with dropdown + mobile menu
    │   │   ├── Card.jsx              # Course card component
    │   │   ├── DoubtSolver.jsx       # Floating AI chat widget
    │   │   ├── ProgressComponents.jsx # WishlistButton, ProgressBar, MarkCompleteButton
    │   │   ├── CursorGradient.jsx    # Animated cursor gradient effect
    │   │   ├── ReviewCard.jsx        # Single review display
    │   │   ├── ReviewPage.jsx        # Reviews section
    │   │   ├── ScrollToTop.jsx       # Auto-scroll on route change
    │   │   ├── About.jsx             # About section
    │   │   ├── Footer.jsx            # Footer component
    │   │   ├── Logos.jsx             # Tech logos section
    │   │   ├── CardPage.jsx          # Course cards grid
    │   │   └── ExploreCourses.jsx    # Explore section
    │   │
    │   ├── redux/
    │   │   ├── store.js              # Redux store (4 reducers)
    │   │   ├── userSlice.js          # User state + loading flag
    │   │   ├── courseSlice.js        # Courses + selected course
    │   │   ├── lectureSlice.js       # Lecture data
    │   │   └── reviewSlice.js        # Review data
    │   │
    │   ├── customHooks/
    │   │   ├── getCurrentUser.js     # Fetch user on mount
    │   │   ├── getCreatorCourse.js   # Fetch educator's courses
    │   │   ├── getPublishedCourse.js # Fetch all published courses
    │   │   └── getAllReviews.js      # Fetch all reviews
    │   │
    │   ├── context/
    │   │   └── ThemeContext.jsx      # Dark/Light mode with localStorage
    │   │
    │   ├── App.jsx                   # Routes + PrivateRoute + EducatorRoute
    │   └── main.jsx                  # BrowserRouter + Redux Provider
    │
    ├── index.html                    # SPA shell + Razorpay CDN script
    └── package.json
```

---

## 🔌 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register with name, email, password, role |
| POST | `/login` | No | Login + set JWT cookie |
| GET | `/logout` | No | Clear JWT cookie |
| POST | `/sendotp` | No | Generate 6-digit OTP, save to DB, send email |
| POST | `/verifyotp` | No | Verify OTP, set isOtpVerified flag |
| POST | `/resetpassword` | No | Reset password after OTP verification |
| POST | `/googleauth` | No | Google OAuth — create or login user |

### User — `/api/user`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/getcurrentuser` | Yes | Get logged-in user with courses + progress |
| POST | `/profile` | Yes | Update name, description, profile photo |
| POST | `/progress` | Yes | Mark lecture complete (embedded in User) |
| GET | `/progress/:courseId` | Yes | Get course progress from User model |

### Course — `/api/course`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Yes | Create new course |
| GET | `/getpublished` | No | Get all published courses |
| GET | `/getcreator` | Yes | Get educator's own courses |
| POST | `/editcourse/:courseId` | Yes | Edit course + optional thumbnail |
| GET | `/getcourse/:courseId` | Yes | Get course by ID |
| DELETE | `/remove/:courseId` | Yes | Delete course |
| POST | `/createlecture/:courseId` | Yes | Add lecture to course |
| GET | `/courselecture/:courseId` | Yes | Get all lectures |
| POST | `/editlecture/:lectureId` | Yes | Edit lecture + optional video |
| DELETE | `/removelecture/:lectureId` | Yes | Delete lecture |
| POST | `/creator` | Yes | Get educator profile by userId |
| POST | `/search` | No | AI-enhanced course search |

### Payment — `/api/order`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/razorpay-order` | No | Create Razorpay order |
| POST | `/verifypayment` | No | Verify + enroll user in course |

### Reviews — `/api/review`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/createreview` | Yes | Create course review |
| GET | `/getreview` | No | Get all reviews |

### AI — `/api/ai`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/doubt` | Yes | AI doubt solver with chat history |
| POST | `/quiz` | Yes | Generate 5-MCQ quiz |
| POST | `/roadmap` | Yes | Generate personalized roadmap |
| POST | `/notes` | Yes | Generate lecture study notes |
| GET | `/recommendations` | Yes | AI course recommendations |

### Features — `/api/features`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/progress/mark` | Yes | Mark lecture complete (Progress model) |
| GET | `/progress/:courseId` | Yes | Get progress percentage |
| GET | `/certificate/:courseId` | Yes | Generate + stream PDF certificate |
| POST | `/wishlist/toggle` | Yes | Toggle course in/out of wishlist |
| GET | `/wishlist` | Yes | Get user's wishlist |

---

## 🗄️ Database Schema

### User Model
```
name          String (required)
email         String (required, unique)
password      String (bcrypt hashed)
role          Enum: ['student', 'educator'] (required)
photoUrl      String (Cloudinary URL)
enrolledCourses  [ObjectId → Course]
courseProgress   [{ course, completedLectures[], progressPercent, lastWatched, completedAt }]
resetOtp      String (6-digit, cleared after verification)
otpExpires    Date (5 minutes from generation)
isOtpVerified Boolean
timestamps    createdAt, updatedAt
```

### Course Model
```
title         String (required)
subTitle      String
description   String
category      String (required)
level         Enum: ['Beginner', 'Intermediate', 'Advanced']
price         Number
thumbnail     String (Cloudinary URL)
enrolledStudents  [ObjectId → User]
lectures      [ObjectId → Lecture]
creator       ObjectId → User
isPublished   Boolean (default: false)
reviews       [ObjectId → Review]
timestamps    createdAt, updatedAt
```

### Lecture Model
```
lectureTitle  String (required)
videoUrl      String (Cloudinary URL)
isPreviewFree Boolean
timestamps    createdAt, updatedAt
```

### Progress Model
```
user          ObjectId → User (required)
course        ObjectId → Course (required)
completedLectures  [ObjectId → Lecture]
isCompleted   Boolean (default: false)
completedAt   Date
Index: { user: 1, course: 1 } unique compound index
```

### Review Model
```
course        ObjectId → Course
user          ObjectId → User
rating        Number (1-5, required)
comment       String
reviewedAt    Date
timestamps    createdAt, updatedAt
```

### Wishlist Model
```
user          ObjectId → User (required, unique index)
courses       [ObjectId → Course]
timestamps    createdAt, updatedAt
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (test mode)
- Google Gemini API key
- Gmail App Password (for OTP emails)
- Firebase project (for Google OAuth)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/sup2810/VertexLearnAI.git
cd VertexLearn/backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add to `.env`:
```env
PORT=4000
MONGODB_URL=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
# Start development server
npm run dev

# Start production server
npm start
```

### Frontend Setup

```bash
cd VertexLearnAI/frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add to `.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔐 Authentication Flow

### Email/Password Login
1. User submits email + password
2. `bcrypt.compare()` verifies password against stored hash
3. `jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })` creates token
4. Token set as `HttpOnly` cookie — `secure:true`, `sameSite:'none'`
5. User object returned (without password field)

### Google OAuth
1. Frontend: `signInWithPopup(auth, provider)` — Firebase opens Google popup
2. `response.user.displayName` and `email` sent to `/api/auth/googleauth`
3. Backend: finds existing user or creates new one
4. JWT cookie set, user object returned

### Password Reset (OTP Flow)
1. User requests OTP → `POST /api/auth/sendotp`
2. `Math.floor(100000 + Math.random() * 900000)` — 6-digit OTP
3. OTP saved to `user.resetOtp`, expiry = `Date.now() + 5 minutes`
4. OTP emailed via Nodemailer (Gmail SMTP)
5. User verifies OTP → `POST /api/auth/verifyotp`
6. `isOtpVerified = true`, OTP fields cleared
7. User resets password → `POST /api/auth/resetpassword`
8. New password bcrypt hashed, saved

### isAuth Middleware
```javascript
const token = req.cookies?.token
// jwt.verify throws on invalid/expired token
const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
req.userId = verifyToken.userId
next()
```

---

## 💳 Payment Flow

```
Student clicks "Enroll Now"
        ↓
POST /api/order/razorpay-order { courseId }
        ↓
Backend: Course.findById → price → Razorpay.orders.create({ amount: price*100, currency:'INR' })
        ↓
Frontend: new window.Razorpay(options) → rzp.open() → payment modal
        ↓
Student pays (UPI/Card/Netbanking)
        ↓
POST /api/order/verifypayment { courseId, userId, razorpay_order_id }
        ↓
Backend: RazorPayInstance.orders.fetch(id) → status === 'paid'
        ↓
user.enrolledCourses.push(courseId) + course.enrolledStudents.push(userId)
        ↓
"Watch Now" button appears — course access granted
```

---

## 🎓 Certificate Generation

When a student completes all lectures:

```
isCompleted = true (Progress model)
        ↓
Student clicks "Download Certificate"
        ↓
GET /api/features/certificate/:courseId (authenticated)
        ↓
Backend: PDFDocument created (A4, landscape)
res.setHeader('Content-Type', 'application/pdf')
res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf')
doc.pipe(res) ← streams PDF bytes directly to HTTP response
        ↓
PDF drawn: borders, decorative elements, student name,
course title, instructor name, completion date, certificate ID
Certificate ID: EV-{last6ofCourseId}-{last6ofUserId}
        ↓
doc.end() → browser downloads file
```

---

## 🤖 AI Search — Two-Stage Strategy

```
User types search query
        ↓
Stage 1: Regex search across title, subTitle, description, category, level
        ↓
Results found? → Return immediately (no Gemini call, fast)
        ↓
No results? → Send query to Gemini
        ↓
Gemini extracts ONE keyword from 11 fixed categories
(App Development, AI/ML, Web Development, Beginner, etc.)
        ↓
Stage 2: Regex search with AI-extracted keyword
        ↓
Return results
```

---

## 🌙 Theme System

```css
/* Light mode (default) */
:root { --bg-primary: #ffffff; --text-primary: #1a1a2e; --accent: #6c63ff; }

/* Dark mode */
[data-theme='dark'] { --bg-primary: #0a0a0f; --text-primary: #f0f0f0; }
```

```javascript
// ThemeContext.jsx
document.documentElement.setAttribute('data-theme', theme)
localStorage.setItem('ev-theme', theme)
```

---

## 🛡️ Security Features

- **HttpOnly cookies** — JWT not accessible via JavaScript (XSS protection)
- **bcrypt hashing** — passwords never stored in plain text
- **CORS whitelist** — only specific origins allowed
- **OTP expiry** — 5-minute time limit on password reset OTPs
- **Input validation** — `validator.isEmail()` on all email fields
- **Ownership checks** — users can only modify their own resources
- **Environment variables** — all secrets in `.env`, never committed

---

## 📊 Redux Store Structure

```javascript
{
  user: {
    userData: Object | null,  // current logged-in user
    loading: Boolean          // prevents flash redirect on PrivateRoute
  },
  course: {
    creatorCourseData: Array | null,   // educator's courses
    courseData: Array | null,          // all published courses
    selectedCourse: Object | null      // course being viewed
  },
  lecture: {
    lectureData: Array                 // lectures for a course
  },
  review: {
    reviewData: Array                  // all reviews
  }
}
```

---

## 🔗 Route Structure

### Public Routes
```
/           → Home (landing page)
/login      → Login page
/signup     → Signup (redirects if logged in)
/forget     → Password reset (3-step OTP flow)
```

### Student Routes (PrivateRoute — login required)
```
/allcourses              → Browse all published courses
/viewcourse/:courseId    → Course details + enroll
/viewlecture/:courseId   → Video player + AI tools
/mycourses               → Enrolled courses
/student-dashboard       → Progress charts
/profile                 → User profile
/editprofile             → Edit profile
/search                  → AI + voice search
/roadmap                 → AI learning roadmap
/quiz/:courseId          → AI quiz
/notes/:courseId         → AI study notes
/wishlist                → Saved courses
```

### Educator Routes (EducatorRoute — educator role required)
```
/dashboard                              → Educator dashboard
/courses                                → Manage courses
/createcourse                           → Create new course
/editcourse/:courseId                   → Edit course
/createlecture/:courseId                → Add lecture
/editlecture/:courseId/:lectureId       → Edit lecture
```

---

## 👨‍💻 Author

**Amaid Khan**
- 🎓 B.Tech Computer Science & Engineering — MNNIT Allahabad
- 🏆 LeetCode Knight Rating
- 💼 SMP Mentor at MNNIT Allahabad

[![GitHub](https://img.shields.io/badge/GitHub-Amaidk7-1a1a2e?style=flat-square&logo=github)](https://github.com/Amaidk7)

---

## 🚀 Future Improvements

- Role-based authorization middleware on backend (isEducator)
- Redis caching for published courses endpoint
- Rate limiting on login and OTP routes
- Pagination for course listings
- Razorpay webhook signature verification
- Automated tests (Jest + Supertest + React Testing Library)
- Comments feature on courses
- Course search with MongoDB text indexes
- Email notifications on enrollment

---

⭐ **If you found this project interesting, please give it a star on GitHub!**
