# ApplyMate - Backend MVP Plan (Hackathon Edition)

**Project:** ApplyMate (Placement Preparation Portal)  
**Hackathon:** Prompt2Product (2 Hours)  
**Stack:** MERN (Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt)

---

## 1. Core MVP Features & Scope

1. **User Authentication (JWT)**: Register & Login endpoints returning user info & JWT token. Protected route middleware.
2. **Company Application Tracker (CRUD)**:
   - Create, Read (with search by company name & status filter), Read One (for individual company view), Update, Delete company applications.
   - Company fields: `name`, `role`, `applicationDate`, `status` (`Applied`, `Online Assessment`, `Technical Interview`, `HR Interview`, `Selected`, `Rejected`), `jd`, `notes`, `resumeFile`.
3. **Preparation Resources (CRUD)**:
   - Create, Read, Delete prep resources.
   - Resource fields: `title`, `category` (`DSA`, `Aptitude`, `Resume`, `Interview Experience`, `Core Subjects`), `link`, optional `linkedCompanyId`.
4. **Dashboard KPI Stats**:
   - Calculated counts: Total Applied, Total Active (Applied/OA/Technical/HR), Total Selected (Offers), Total Rejected.

---

## 2. Server Directory & File Structure

```
server/
├── controllers/
│   ├── auth.controller.js       # Register & Login handlers
│   ├── company.controller.js    # Create, Get (Search/Filter), Get Stats, Get One, Update, Delete
│   └── resource.controller.js   # Create, Get, Delete resources
├── middleware/
│   └── auth.middleware.js       # Protect routes via JWT token
├── models/
│   ├── user.model.js            # User Schema (name, email, password)
│   ├── company.model.js         # Company Application Schema
│   └── resource.model.js        # Preparation Resource Schema
├── routes/
│   ├── auth.routes.js           # /api/auth
│   ├── company.routes.js        # /api/companies
│   └── resource.routes.js       # /api/resources
├── services/
│   ├── auth.service.js          # Authentication logic
│   ├── company.service.js        # Company CRUD logic & KPI stats
│   └── resource.service.js       # Resource CRUD logic
├── .env                         # PORT, DATABASE_URL, JWT_SECRET
├── package.json
└── server.js                    # Express app setup & DB connection
```

---

## 3. Database Schemas (Mongoose)

### 3.1 User Model (`models/user.model.js`)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false }
  },
  { timestamps: true }
);
```

### 3.2 Company Model (`models/company.model.js`)
```javascript
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    jd: { type: String, default: '' },
    notes: { type: String, default: '' },
    resumeFile: { type: String, default: '' }
  },
  { timestamps: true }
);
```

### 3.3 Resource Model (`models/resource.model.js`)
```javascript
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['DSA', 'Aptitude', 'Resume', 'Interview Experience', 'Core Subjects'],
      required: true
    },
    link: { type: String, required: true },
    linkedCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null }
  },
  { timestamps: true }
);
```

---

## 4. API Specification

### 4.1 Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT | No |

### 4.2 Application Routes (`/api/companies`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/companies` | Get all companies (Query: `search`, `status`) | Yes |
| `GET` | `/api/companies/stats` | Get KPI Dashboard counts | Yes |
| `GET` | `/api/companies/:id` | Get individual company detail | Yes |
| `POST` | `/api/companies` | Add new company application | Yes |
| `PUT` | `/api/companies/:id` | Update company application | Yes |
| `DELETE` | `/api/companies/:id` | Delete company application | Yes |

### 4.3 Resource Routes (`/api/resources`)
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/resources` | Get all preparation resources | Yes |
| `POST` | `/api/resources` | Add new preparation resource | Yes |
| `DELETE` | `/api/resources/:id` | Delete resource | Yes |

---

## 5. Development & Running

1. **Environment Config (`.env`)**:
   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/applymate
   JWT_SECRET=applymate_hackathon_jwt_secret_2026
   ```

2. **Run Server**:
   ```bash
   cd server
   npm run dev
   ```
