# Product Requirements Document (PRD)
## Placement Preparation Portal

**Version:** 1.0
**Type:** Hackathon Build → Extended Product Vision
**Stack:** MERN (MongoDB, Express.js, React + Vite, Node.js)
**Auth:** JWT
**Doc Status:** Final — for implementation planning

---

## 1. Overview

### 1.1 Problem Statement
Students preparing for campus placements track company applications, interview rounds, prep resources, and deadlines across scattered spreadsheets, notes apps, and messages. This fragmentation causes missed follow-ups, duplicated effort, and no clear picture of overall readiness.

### 1.2 Product Vision
The Placement Preparation Portal is a single, authenticated web application where a student manages their entire placement journey — from adding a company to tracking every interview round, storing prep resources, journaling interview experiences, and understanding their own patterns of success and failure across companies.

The base version satisfies the hackathon's mandatory requirements (auth, CRUD, dashboard, search/filter, resources). On top of that, this PRD defines a **second layer of "untapped" features** — capabilities that don't exist in typical spreadsheet-based tracking and that only make sense once the data is structured and centralized: **Smart Action Center, Timeline View, Preparation Progress, Interview Journal, and Company Insights.**

### 1.3 Why These Additions Matter
A spreadsheet can store a status column. It cannot:
- Tell the student **what to do next, today**, across all companies at once.
- Show **how their journey unfolded over time**.
- Tell them **how ready they actually are** for a given round or subject.
- Let them **reflect on and learn from** past interviews.
- Show them **patterns** — e.g. "you get rejected most often at the technical round."

These five features convert the portal from a passive tracker into an active preparation assistant — without using AI/ML, purely through smart data modeling, aggregation, and UI design.

---

## 2. Goals & Non-Goals

### 2.1 Goals
- Centralize all placement-related data (companies, resources, notes, resumes, journal entries) in one authenticated portal.
- Give the student a real-time, at-a-glance understanding of their placement status (Dashboard + KPIs).
- Proactively surface what needs attention (Smart Action Center) instead of requiring the student to remember.
- Visualize the journey and preparation level over time (Timeline, Preparation Progress).
- Build a durable, personal record of interview experiences (Interview Journal).
- Surface data-driven patterns about the student's own performance across companies (Company Insights).
- Be fully responsive, with dark mode, and support CSV export of core data.

### 2.2 Non-Goals (for this build)
- No AI/ML-based recommendations, resume scoring, or NLP — all "smart" features are rule-based/derived from structured data the user enters.
- No third-party integration with actual job portals (e.g., auto-import from LinkedIn/Naukri) — out of scope for this version.
- No multi-user collaboration, mentor/admin roles, or public sharing — single-user, private data only.
- No native mobile app — responsive web only.

---

## 3. User Persona

**Primary User: The Placement-Season Student**
- Applying to 10–40+ companies over a few months.
- Juggling multiple interview rounds at different stages simultaneously.
- Needs to revise DSA/Aptitude/Core Subjects/Resume in parallel with applying.
- Wants to know, at a glance: "What do I need to do today?" and "How ready am I?"
- Wants to look back after each interview and remember what was asked, so they improve for the next one.

---

## 4. Information Architecture / Pages

1. **Landing Page** (optional, marketing-style intro)
2. **Signup**
3. **Login**
4. **Dashboard** (home after login)
5. **Company List View** (search/filter/sort/paginate)
6. **Individual Company Page** (deep-dive per company)
7. **Preparation Resources**
8. **Timeline View**
9. **Preparation Progress**
10. **Interview Journal**
11. **Company Insights**
12. **Smart Action Center** (can live as a Dashboard widget/section rather than a standalone page)
13. **Profile Page**

---

## 5. Core Features (Mandatory / Already Decided)

### 5.1 Authentication
- User Registration (name, email, password)
- User Login
- JWT-based session (access token; refresh token optional)
- Passwords hashed (bcrypt) — never stored in plain text
- Protected routes: all pages except Landing/Login/Signup require a valid JWT
- Input validation on both client and server

### 5.2 Dashboard
Displayed immediately after login. Contains:
- **KPI Cards:**
  - Total Companies Applied
  - Total Active Applications (status not in {Selected, Rejected})
  - Total Offers / Selected
  - Total Rejected Applications
- **Charts** (using recharts or similar):
  - Status distribution (pie/donut: Applied, OA, Technical, HR, Selected, Rejected)
  - Applications over time (line/bar, by week or month)
- **Smart Action Center** widget (see Section 6.1) surfaced prominently at the top
- Quick links to Company List, Resources, Timeline, Journal

### 5.3 Company Application Tracker (CRUD)
Standard fields per company:
- Company Name
- Role
- Application Date
- Status (enum: Applied, Online Assessment, Technical Interview, HR Interview, Selected, Rejected)

Operations: Add, View All, Update, Delete.

### 5.4 Individual Company Page
Expands a single company into a full workspace:
- Core fields: Name, Role, Application Date, Status
- **Resume specific to this company** (upload/attach — see Section 5.7 bonus scope)
- **Job Description (JD)** — text or link field
- **Prep Resources** scoped/tagged to this company (Title, Category, Link) — pulled from or linked to the global Resources pool
- **Notes** — free-text notes area for anything company-specific
- Entry point into that company's **Interview Round Tracker / Timeline events** and **Journal entries**

### 5.5 Search & Filter
On the Company List View:
- Search by Company Name (live/debounced search)
- Filter by Application Status (single or multi-select)
- (Recommended addition) Sort by Application Date, and Pagination — since both were listed as hackathon bonus options and directly support usability once a student has 20+ companies

### 5.6 Preparation Resources
Global resource library, independent of any one company:
- Title
- Category (enum: DSA, Aptitude, Resume, Interview Experience, Core Subjects)
- Link
- Add Resource / Get Resources (list, filterable by Category)
- Resources can optionally be **linked/tagged to a specific company** for use on that Individual Company Page

### 5.7 Additional Confirmed Features
- **Responsive Mobile Design** — all pages usable on mobile breakpoints
- **Export to CSV** — export the company list (with all fields/status) to a CSV file
- **Dark Mode Toggle** — persisted per user (stored in profile or local storage)
- **Resume Upload** — per-company resume attachment (file upload, stored reference in DB, actual file in storage/objectstore or base64 for hackathon scope)

---

## 6. New "Untapped" Features (This PRD's Core Addition)

These are the features that differentiate the portal from a glorified spreadsheet. Each is described with: purpose, what the user sees, and what data it depends on.

### 6.1 Smart Action Center
**Purpose:** Answer the student's most common question — "What should I do today?" — without them having to check every company individually. This is rule-based intelligence, not AI: it's derived by scanning all of the student's companies/rounds and applying simple time/status rules.

**What it surfaces (examples of rules):**
- Companies with an upcoming interview round in the next 3 days → "Upcoming: Technical Interview at X on [date]"
- Companies stuck in "Applied" status for more than 14 days with no update → "Consider following up with X"
- Companies with a round completed but no Journal entry logged → "You haven't logged your Technical Interview experience for X"
- Companies where a JD exists but no Prep Resources have been linked → "No prep resources linked for X — add some"
- Recently added companies with an empty Resume field → "Resume missing for X"

**UI:** A prioritized, dismissible list/feed of action cards on the Dashboard, each linking directly to the relevant Individual Company Page. Each card has a clear call-to-action button (e.g., "Log Journal Entry", "Add Resource", "View Company").

**Data dependency:** Application Date, Status, Status-change timestamps, linked Journal entries, linked Resources, Resume presence — all already captured elsewhere; this feature is a derived/aggregated view, not new raw data entry.

### 6.2 Timeline View
**Purpose:** Give the student a chronological, visual narrative of their entire placement journey — every application, every status change, every interview round — across all companies in one scrollable view.

**What it shows:**
- A vertical (or horizontal, on desktop) timeline of events, ordered by date:
  - "Applied to Company X" (Application Date)
  - "Moved to Online Assessment — Company X"
  - "Technical Interview scheduled — Company X"
  - "Selected — Company X" / "Rejected — Company X"
- Each event is a compact card: company name, event type, date, and a link to the Company/Journal entry.
- Filterable by company, by status/event type, or by date range.
- Optionally grouped by week/month for readability when there are many events.

**Data dependency:** A `StatusHistory`/`Event` sub-collection per company, recording each status transition with a timestamp (rather than only storing the current status). This is the key data-model addition needed to support this feature (see Section 8.2).

### 6.3 Preparation Progress
**Purpose:** Give the student a measurable sense of "how ready am I?" across the preparation categories that matter — DSA, Aptitude, Resume, Interview Experience, Core Subjects — rather than a vague feeling.

**What it shows:**
- A progress view per **Resource Category**, computed from resources the student has marked as "completed/reviewed" out of the total they've added to that category.
  - e.g., DSA: 12/20 resources marked complete → 60% progress bar
- A simple **completion checkbox/status** added to each Resource (e.g., Not Started / In Progress / Completed) — a small extension of the existing Resource model.
- An overall "Readiness Score" per category shown as progress bars/radial charts on a dedicated Preparation Progress page and summarized on the Dashboard.
- Optional: a per-company "Readiness" indicator — e.g., if a company's linked resources are mostly incomplete, flag it as "Under-prepared" (feeds into the Smart Action Center too).

**Data dependency:** Adds a `completionStatus` field to the Resource model. Progress is a simple aggregate (completed / total) per category — again rule-based, not AI-based.

### 6.4 Interview Journal
**Purpose:** Let the student build a durable, searchable personal record of what actually happened in each interview round — questions asked, difficulty, self-rated performance, and reflections — so they can learn and improve round over round, company over company.

**What it captures per entry:**
- Linked Company + Round (e.g., "Technical Interview — Company X")
- Date of interview
- Questions Asked (free text / list)
- Topics Covered (tags, e.g., "Arrays", "System Design", "HR — Strengths/Weaknesses")
- Self-rated Difficulty (e.g., Easy/Medium/Hard or 1–5)
- Self-rated Performance (1–5 or Good/Average/Poor)
- Reflection/Notes ("What I should have answered better", "What went well")
- Outcome of that round (optional, can pull from company status)

**What the student sees:**
- A chronological or company-grouped list of all Journal entries.
- Ability to filter by Company, by Round type, or by Topic tag.
- Each entry is editable/deletable.
- Entries surfaced contextually on the Individual Company Page (that company's own journal history) and in aggregate on the Journal page.

**Data dependency:** New `JournalEntry` collection, linked to `companyId` and optionally `roundId`/event.

### 6.5 Company Insights
**Purpose:** Turn the accumulated data (across all companies, rounds, and journal entries) into simple, honest, data-driven feedback about the student's own patterns — purely computed from their own historical data, no AI required.

**What it shows (examples):**
- **Conversion funnel:** Applied → OA → Technical → HR → Selected, shown as a funnel chart with drop-off counts/percentages at each stage across all companies.
- **Weakest Round:** "You are rejected most often at: Technical Interview (X% of rejections)" — computed by counting which round-status a company was in at time of rejection.
- **Topic patterns from Journal:** "Most frequently tagged topic across your interviews: Arrays/DSA" — a simple frequency count over Journal topic tags.
- **Time-to-response:** Average number of days between Application Date and first status change, to spot which companies are slow/fast.
- **Category correlation (lightweight):** e.g., companies where the student had "Completed" DSA prep resources linked show a higher pass-through rate to the next round vs. companies where DSA prep was incomplete — a simple grouped comparison, not a predictive model.

**UI:** A dedicated Company Insights page with a handful of charts (funnel chart, bar chart for weakest round, tag-frequency bar/word-count list) plus 2–3 short auto-generated but rule-based text takeaways (e.g., "Your Technical Interview stage has your lowest pass rate — consider allocating more DSA revision time.").

**Data dependency:** Aggregates across `StatusHistory` (6.2), `JournalEntry` (6.4), and `Resource.completionStatus` (6.3). This feature is the "payoff" layer that only works because the other four features already exist — it should be built last.

---

## 7. Feature Dependency Order (Build Sequence Recommendation)

Because Company Insights and the Smart Action Center depend on data produced by other features, the recommended build order is:

1. Auth (Register/Login/JWT/Protected routes)
2. Company CRUD + Dashboard KPIs (base data model)
3. Search/Filter/Sort/Pagination on Company List
4. Preparation Resources (global + linkable to company) incl. `completionStatus` field
5. Individual Company Page (JD, Notes, Resume upload, linked Resources)
6. **StatusHistory event logging** (technical prerequisite — log every status change, not just current status)
7. Timeline View (consumes StatusHistory)
8. Interview Journal (new collection, linked to Company)
9. Preparation Progress (aggregates Resource.completionStatus)
10. Smart Action Center (aggregates across Company, StatusHistory, Resource, Journal)
11. Company Insights (aggregates across everything — build last)
12. Polish: Dark Mode, Responsive pass, CSV Export, Profile Page

---

## 8. Data Model (High-Level)

### 8.1 User
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | |
| name | String | |
| email | String | unique |
| passwordHash | String | bcrypt |
| darkModePref | Boolean | optional, for persisted theme |
| createdAt | Date | |

### 8.2 Company
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | |
| userId | ObjectId | ref User |
| name | String | |
| role | String | |
| applicationDate | Date | |
| status | Enum | Applied / OA / Technical / HR / Selected / Rejected |
| jd | String | text or link |
| notes | String | |
| resumeFile | String | file ref/URL |
| statusHistory | [ { status: Enum, changedAt: Date } ] | **new — powers Timeline & Insights** |
| createdAt / updatedAt | Date | |

### 8.3 Resource
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | |
| userId | ObjectId | ref User |
| title | String | |
| category | Enum | DSA / Aptitude / Resume / Interview Experience / Core Subjects |
| link | String | |
| completionStatus | Enum | Not Started / In Progress / Completed — **new, powers Preparation Progress** |
| linkedCompanyId | ObjectId (optional) | ref Company, for company-scoped resources |
| createdAt | Date | |

### 8.4 JournalEntry (new)
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | |
| userId | ObjectId | ref User |
| companyId | ObjectId | ref Company |
| roundType | Enum | matches Company.status round types |
| interviewDate | Date | |
| questionsAsked | String / [String] | |
| topics | [String] | tags |
| difficulty | Enum/Number | |
| performanceRating | Enum/Number | |
| reflection | String | |
| createdAt | Date | |

---

## 9. API Surface (Extended)

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Companies
- `POST /api/companies`
- `GET /api/companies` (supports `?search=`, `?status=`, `?sort=`, `?page=`)
- `GET /api/companies/:id`
- `PUT /api/companies/:id`
- `DELETE /api/companies/:id`
- `PATCH /api/companies/:id/status` — updates status **and** appends to `statusHistory`
- `GET /api/companies/export/csv`

### Resources
- `POST /api/resources`
- `GET /api/resources` (supports `?category=`, `?companyId=`)
- `PATCH /api/resources/:id/completion`

### Journal
- `POST /api/journal`
- `GET /api/journal` (supports `?companyId=`, `?topic=`)
- `PUT /api/journal/:id`
- `DELETE /api/journal/:id`

### Timeline
- `GET /api/timeline` — aggregated, sorted feed built from all companies' `statusHistory`

### Insights
- `GET /api/insights/funnel`
- `GET /api/insights/weakest-round`
- `GET /api/insights/topic-frequency`
- `GET /api/insights/response-time`

### Smart Action Center
- `GET /api/actions` — server-computed list of actionable items (see rules in 6.1)

### Profile
- `GET /api/profile`
- `PUT /api/profile`

---

## 10. Non-Functional Requirements
- **Security:** Passwords hashed (bcrypt), JWT stored securely (httpOnly cookie preferred over localStorage), all Company/Resource/Journal routes scoped to `req.user.id` — no cross-user data leakage.
- **Validation:** Server-side validation on all inputs (required fields, enum checks, date formats).
- **Performance:** Pagination on Company List and Journal to avoid loading large datasets at once.
- **Responsiveness:** All pages functional at mobile (≤480px), tablet, and desktop breakpoints.
- **Accessibility:** Sufficient color contrast in both light and dark mode; forms keyboard-navigable.
- **Modularity:** Clean separation of routes/controllers/models on the backend; component-based structure on the frontend.

---

## 11. Success Criteria
- All mandatory hackathon requirements fully functional (Auth, Dashboard, CRUD, Search/Filter, Resources).
- Timeline, Preparation Progress, Interview Journal, Company Insights, and Smart Action Center are all live and pulling from real user data (no hardcoded/mock data).
- A user can go from Signup → Add 3+ companies → Log status changes → See them reflected correctly in the Timeline, Dashboard KPIs, Smart Action Center, and Insights.
- CSV export produces a correct, complete file of company data.
- App is fully usable on a mobile viewport and in dark mode.

---

## 12. Open Questions for Implementation Planning
- Resume storage: local/base64 for hackathon speed, or a proper object storage bucket if time allows?
- Should `statusHistory` be auto-appended on every `status` field change, or require an explicit "Log Status Change" action from the user (affects whether Timeline data is 100% reliable)?
- Should Company Insights be computed on-the-fly (query-time aggregation) or pre-computed/cached given the 2-hour build window?
- Journal entries: should they be mandatory before a company's status can move to "Selected"/"Rejected", to guarantee Insights data completeness — or fully optional?
