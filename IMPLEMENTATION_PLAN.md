# Implementation Plan: Placement Preparation Portal (MERN Stack)

## Context
The repository contains the Product Requirement Document (`PRD.md`) and initial skeleton setup (`client` and `server`). This document outlines the step-by-step implementation of the Placement Preparation Portal as defined in the PRD, following the MERN stack (MongoDB, Express.js, React + Vite) and adhering to non-functional requirements (security, responsiveness, accessibility, performance).

The implementation follows the PRD’s recommended build order to ensure foundational dependencies are satisfied early, enabling analytics and smart assistant features to rely on well-structured data models.

---

## Technology Choices
* **Backend:** Node.js (Express), Mongoose (ODM), JWT (bcrypt for password hashing), multer (file upload for resumes), dotenv, cors, helmet, Joi (validation).
* **Frontend:** React 18, Vite (bundler), React Router v6, `@tanstack/react-query` / React Context API (state management), Tailwind CSS (styling), Axios (HTTP client), Recharts (charts for Dashboard/Insights), date-fns (date formatting).
* **Development:** ESLint, Prettier, Concurrently (dev server), nodemon.
* **Database:** MongoDB (local or Atlas).
* **Testing:** Jest (unit), React Testing Library (component), SuperTest (API), Cypress / Playwright (E2E) – optional/recommended.

---

## Implementation Phases

### Phase 0: Project Setup
**Goal:** Initialize repository with frontend and backend skeletons, configure tooling, and establish shared conventions.

* **Backend:**
  * Initialize `server/` folder with `npm init -y`.
  * Install core dependencies: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `bcryptjs`, `jsonwebtoken`, `joi`, `multer`.
  * Create basic server file (`server.js`) with environment loading, middleware, and error handling.
  * Set up MongoDB connection utility (`utils/db.js`).
  * Configure ESLint & Prettier.
  * Add scripts: `dev` (nodemon), `start`, `test`.

* **Frontend:**
  * Initialize `client/` folder with Vite template.
  * Install dependencies: `react-router-dom`, `axios`, `@tanstack/react-query`, `@hookform/resolvers`, `yup`, `react-icons`, `recharts`, `date-fns`.
  * Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `eslint`, `prettier`.
  * Configure Tailwind (`tailwind.config.js` and `src/index.css`).
  * Set up Vite proxy for API calls (`vite.config.js`).
  * Create basic `src/main.jsx` with React Router provider.

* **Shared:**
  * Configure `.gitignore` (`node_modules`, `.env`, build files, etc.).
  * Define API base URL convention.

* **Verification:**
  * `npm run dev` in both folders starts backend and frontend concurrently.
  * Verify API health endpoint (`GET /api/health`) returns 200.
  * Verify frontend loads at `http://localhost:5173` and shows placeholder.

---

### Phase 1: Authentication & User Model
**Goal:** Secure user registration, login, JWT-protected routes, password hashing.

* **Backend:**
  * **Models:** `user.js` (fields: `name`, `email`, `passwordHash`, `darkModePref`, timestamps).
  * **Controllers:** `authController.js` (register, login, protected test route).
  * **Middleware:** `authMiddleware.js` (verify JWT, attach `req.user`), `validate.js` (Joi schemas for registration/login).
  * **Routes:** `routes/auth.js` (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`).
  * **Utils:** `generateToken.js`, `hashPassword.js`.
  * **Error Handling:** Central error handler.

* **Frontend:**
  * **Context:** `AuthContext.js` (state: user, token, login/logout functions, loading).
  * **Pages:** `Register.jsx`, `Login.jsx` (form validation with Yup/React Hook Form).
  * **Service:** `api/auth.js` (register, login, setAuthToken).
  * **ProtectedRoute:** Component that redirects unauthenticated users to login.
  * **Layout:** Simple navbar with login/logout links (conditionally rendered).
  * **Token Storage:** HttpOnly cookies preferred, fallback to secure storage handling.

* **Verification:**
  * Register a new user, receive JWT.
  * Login with same credentials, receive JWT.
  * Access protected route (`/api/auth/me`) returns user data.
  * Invalid credentials yield 401.
  * Passwords are bcrypt-hashed in DB.

---

### Phase 2: Core Company CRUD + Dashboard KPIs + Basic Search/Filter
**Goal:** Enable users to add, view, update, delete company applications; show dashboard with KPI cards and basic charts.

* **Backend:**
  * **Models:** `company.js` (fields: `userId` [Ref User], `name`, `role`, `applicationDate`, `status` [enum: Applied, OA, Technical, HR, Selected, Rejected], `jd` [String/URL], `notes` [String], `resumeFile` [String URL/ref], `statusHistory` [array of `{status, changedAt}`], timestamps).
  * **Pre-hooks:** Initialize `statusHistory` on create.
  * **Controllers:** `companyController.js` (CRUD: `getAll`, `getById`, `create`, `update`, `delete`).
  * **Middleware:** `validateCompany.js` (Joi schema for create/update).
  * **Routes:** `routes/company.js` (protected, CRUD endpoints, plus `GET /api/companies/export/csv`).
  * **Utilities:** CSV export utility (`utils/csv.js` using `json2csv`).
  * **Filters/Search:** Query params `?search=`, `?status=`, `?sort=`, `?page=`, `?limit=`.

* **Frontend:**
  * **State:** Company list state (using React Query / Context).
  * **Pages:**
    * `CompanyList.jsx`: search bar, status filter dropdown, sort selector, pagination controls, table of companies with action buttons (View, Edit, Delete).
    * `CompanyForm.jsx`: reusable form for create/edit (`name`, `role`, `applicationDate`, `status`, `jd`, `notes`, `resume`).
    * `CompanyDetail.jsx`: read-only view with tabs for Notes, Resume, etc.
  * **Service:** `api/company.js` (CRUD + export CSV).
  * **Dashboard:**
    * `Dashboard.jsx`: KPI cards (Total Companies, Active Applications, Offers, Rejected).
    * **Charts:** Status distribution (pie chart), applications over time (line/bar chart) using Recharts.
  * **UI:** Tailwind responsive table, forms, buttons, modals.

* **Verification:**
  * Create a company with all fields; confirm DB entry.
  * List companies; search and filters work.
  * Edit company; changes persist.
  * Delete company; removed from list.
  * CSV export downloads correct data.
  * Dashboard KPIs reflect current data.

---

### Phase 3: Search / Filter / Sort / Pagination Enhancements
**Goal:** Implement debounced search, multi-select status filter, client-side sorting, and paginated loading.

* **Frontend:**
  * Improve `CompanyList`:
    * Debounce search input (300ms).
    * Checkbox group for multi-status filter.
    * Sort dropdown (by `applicationDate` descending/ascending, `name`).
    * Pagination controls (show X per page, next/prev).
  * Use server-side pagination (send `page` & `limit`), total count returned for pagination UI.

* **Verification:**
  * Search updates after debounce.
  * Multiple status filters work.
  * Sorting changes order correctly.
  * Pagination loads correct pages and total count matches.

---

### Phase 4: Preparation Resources (Global + Company-Scoped) + Completion Status
**Goal:** Allow users to add preparation resources, mark completion, link resources to companies.

* **Backend:**
  * **Model:** `resource.js` (`userId`, `title`, `category` [enum: DSA, Aptitude, Resume, Interview Experience, Core Subjects], `link`, `completionStatus` [enum: Not Started, In Progress, Completed], `linkedCompanyId` [optional Ref Company], timestamps).
  * **Controller:** `resourceController.js` (CRUD, toggle completion, link/unlink to company).
  * **Routes:** `routes/resource.js` (protected).
  * **Validation:** Joi schema for resource.

* **Frontend:**
  * **Pages:**
    * `ResourcesList.jsx`: filter by category, add resource button, list with completion toggles.
    * `ResourceForm.jsx`: create/edit resource (`title`, `category`, `link`, optional company dropdown).
  * **Service:** `api/resource.js`.
  * **Integration:** On `CompanyDetail` page, show "Linked Resources" section; allow linking existing resources or adding new ones.

* **Verification:**
  * Add resources in each category.
  * Toggle completion status; persists in DB.
  * Link resource to a company; appears on company's detail page.

---

### Phase 5: Individual Company Page Enhancements
**Goal:** Provide a rich, tabbed view for each company supporting notes, resume upload, linked resources, and status change logging.

* **Backend:**
  * Add endpoint `PATCH /api/companies/:id/status` that updates `status` field and pushes to `statusHistory`.

* **Frontend:**
  * `CompanyDetail.jsx` tabs:
    * **Overview:** Core fields, status badge.
    * **JD & Notes:** Edit inline.
    * **Resume:** Preview/download/upload.
    * **Linked Resources:** List with ability to add new or link existing.
    * **Status History:** Timeline of status changes.
  * **Status Dropdown:** On change, call `PATCH` endpoint; update `statusHistory` optimistically.

* **Verification:**
  * View company details; all sections editable.
  * Change status; new entry appears in `statusHistory`.
  * Upload resume; file stored and link saved.

---

### Phase 6: Status History Logging & Timeline View
**Goal:** Enable the Timeline view to show a chronological feed of all status changes across companies.

* **Backend:**
  * Ensure `statusHistory` updates on every status change.
  * Add endpoint `GET /api/timeline`:
    * Aggregates `statusHistory` from all companies for logged-in user.
    * Supports query params: `?companyId=`, `?status=`, `?startDate=`, `?endDate=`.
    * Sorted descending by `changedAt`.

* **Frontend:**
  * **Page:** `Timeline.jsx`:
    * **Filters:** Company selector dropdown, status multiselect, date range picker.
    * **Main Area:** Vertical timeline UI showing company name, status badge, date, link to company detail.
  * **Service:** `api/timeline.js`.

* **Verification:**
  * Changing a company’s status creates a new timeline entry.
  * Filters correctly narrow the timeline.
  * Chronological descending sort order verified.

---

### Phase 7: Interview Journal
**Goal:** Allow users to create journal entries linked to a company and interview round.

* **Backend:**
  * **Model:** `journalEntry.js` (`userId`, `companyId` [Ref Company], `roundType`, `interviewDate`, `questionsAsked`, `topics` [Array of Strings], `difficulty` [Easy/Medium/Hard], `performanceRating`, `reflection`, timestamps).
  * **Controller:** `journalController.js` (CRUD).
  * **Routes:** `routes/journal.js`.

* **Frontend:**
  * **Pages:**
    * `JournalList.jsx`: filter by company, round, topic; date sort; add entry button.
    * `JournalForm.jsx`: create/edit entry form.
    * `JournalEntry.jsx`: read-only view of a single entry.
  * **Integration:** "Add Journal Entry" button from Company Detail page pre-fills company info.

* **Verification:**
  * Create journal entry; appears in list.
  * Filter by company, round, topic.
  * Edit/delete entries.

---

### Phase 8: Preparation Progress (Aggregate Resource Completion)
**Goal:** Show progress per preparation category and overall readiness score.

* **Backend:**
  * Endpoint `GET /api/resources/progress`:
    * Group by category, count total and count where `completionStatus === 'Completed'`.
    * Return array: `{ category, total, completed, percentage }`.

* **Frontend:**
  * **Page:** `PreparationProgress.jsx`:
    * Progress charts per category (using Recharts or SVG).
    * Overall readiness score.
    * List of resources per category with completion toggles.

* **Verification:**
  * Updating resource completion updates progress percentages.
  * Overall score computes accurately.

---

### Phase 9: Smart Action Center
**Goal:** Surface actionable items based on intelligent rules.

* **Backend:**
  * Endpoint `GET /api/actions`:
    * Returns array of action objects: `{ id, type, message, companyId, actionUrl, priority }`.
    * **Rules:**
      * Stuck in `Applied` > 14 days.
      * Missing journal entry after interview status change.
      * Missing prep resources linked to an active company.
      * Missing resume link/upload.

* **Frontend:**
  * **Dashboard Widget:** Interactive list of action cards with direct action buttons (e.g., "Add Resume", "Log Interview", "Add Resource").
  * Button clicks navigate to relevant pages.

* **Verification:**
  * Trigger each rule with test data.
  * Action cards display correct priority and navigation buttons work.

---

### Phase 10: Company Insights & Analytics
**Goal:** Provide data-driven feedback on user’s placement preparation performance across companies.

* **Backend:**
  * **Endpoints (`/api/insights/*`):**
    * `GET /api/insights/funnel`: Application pipeline funnel aggregation.
    * `GET /api/insights/weakest-round`: Identifies round with highest rejection rate.
    * `GET /api/insights/topic-frequency`: Aggregates most frequent interview topics from journals.
    * `GET /api/insights/response-time`: Average response duration between application and initial feedback.

* **Frontend:**
  * **Page:** `CompanyInsights.jsx`:
    * Funnel visualization chart.
    * Weakest round bar chart.
    * Topic frequency breakdown.
    * Key textual takeaways & recommendations.

* **Verification:**
  * Populate sample data with varied outcomes.
  * Aggregation endpoints return accurate calculations.
  * Visualizations update dynamically.

---

### Phase 11: Polish & Non-Functional Requirements
**Goal:** Ensure responsiveness, dark mode, CSV export, profile page, accessibility, security, and performance.

* **Features:**
  * **Dark Mode:** User preference toggle, persisted in DB and local state, Tailwind `dark:` variants.
  * **Profile Page:** Edit name, email, change password.
  * **Responsiveness:** Fully responsive across mobile, tablet, and desktop breakpoints.
  * **Accessibility (a11y):** Semantic HTML, ARIA attributes, keyboard navigation support.
  * **Security:** Bcrypt password hashing (>= 12 rounds), Rate limiting, Helmet, CORS, Joi sanitization/validation.
  * **Performance:** Mongoose schema indexes (`userId`, `status`, `applicationDate`), query pagination.

---

## Deliverables
1. Source code in `client/` and `server/` directories.
2. `README.md` with environment variable setup and installation guides.
3. `.env.example` templates for frontend and backend.
4. Comprehensive implementation plan (`IMPLEMENTATION_PLAN.md`).
5. Working placement preparation portal web application.
