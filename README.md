# Budget Buddy — Plan Smarter. Earn Better. Build Wealth.

> **AI-Powered Personal Finance, Career Growth & Wealth-Building Platform**

Budget Buddy is a full-stack, production-grade application engineered to empower individuals—both employed and unemployed—to achieve economic security, career advancement, and long-term financial independence.

---

## 🌟 Core Modules

### 1. PEACE Wealth Engine
**PEACE — Personal Economic Advancement & Career Engine** is an execution and wealth-building module designed to bridge the gap between career ambitions and disciplined financial execution:

* **Opportunity Discovery**: Personalized income-generating pathways (Technology, Freelance, Local Services, Remote Consulting) matched against user skills, available capital, and learning timelines.
* **Deterministic Wealth Simulator**: 3-scenario Monte Carlo-style compound interest simulations (Conservative 5%, Moderate 8%, Ambitious 11%) calculating savings capacity, emergency runway, required capital, and shortfall analysis with complete mathematical transparency.
* **Career Roadmap & Milestones**: Structured phased milestones guiding users from foundational skill-building to first revenue generation.
* **Adaptive Daily Planner**: Generates exactly 7 high-leverage daily tasks:
  1. `MORNING_FOCUS` — Strategic priority for the day
  2. `SKILL_LEARNING` — Deliberate practice & upskilling
  3. `INCOME_TASK` — Direct revenue-generating execution
  4. `CLIENT_OUTREACH` — Applications, networking, or client proposals
  5. `SAVINGS_ACTION` — Daily expense discipline & allocation
  6. `HEALTH_ACTION` — Mental/physical stamina preservation
  7. `REVIEW_TASK` — End-of-day reflection & backlog grooming
* **Compassionate Rescheduling Engine**: Allows users facing illness or family emergencies to postpone tasks safely without streak penalties or guilt. Incomplete tasks can be carried forward intelligently.
* **GitHub-Style Progress Heatmap**: Visualizes consistency, streaks, task completions, and rescheduling patterns.
* **Location Intelligence**: Compares cost of living, median salaries, and net savings potential across major Indian economic hubs (Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Delhi-NCR, Remote).

---

### 2. Smart Expense Manager & AI Advisor
A privacy-first personal finance system:

* **OCR Receipt Scanner**: Automated text extraction and parsing using Tesseract OCR with intelligent line-item, subtotal, tax, and merchant recognition. Includes native fallbacks for zero-setup execution.
* **Transaction Ledger**: Categorized income and expense logging with search, filter, pagination, and one-click CSV export.
* **Envelope Budgeting**: Real-time category budget allocation, percentage utilization metrics, and proactive overspending alerts.
* **AI Financial Advisor**: Context-aware financial observations and actionable recommendations grounded strictly on stored user records. Includes strict educational disclaimers (not regulated financial/tax/investment advice).

---

## 🇮🇳 Multilingual Support
Budget Buddy provides native localization across 8 Indian languages:
1. **English** (`en`)
2. **Telugu** (`te` — తెలుగు)
3. **Hindi** (`hi` — हिन्दी)
4. **Tamil** (`ta` — தமிழ்)
5. **Kannada** (`kn` — ಕನ್ನಡ)
6. **Malayalam** (`ml` — മലയാളം)
7. **Marathi** (`mr` — मराठी)
8. **Bengali** (`bn` — বাংলা)

---

## 🏗️ Architecture & Technology Stack

### Backend
* **Java 17 LTS / Spring Boot 3.3.4**
* **Spring Security 6** with stateless JWT authentication & refresh-token rotation
* **Spring Data JPA & Hibernate**
* **Flyway** schema versioning & seed migrations
* **Tess4J / Tesseract OCR** receipt parsing engine with regex heuristics
* **H2 Database** (in-memory mode for development) & **MySQL 8.x** (production-ready)
* **SpringDoc OpenAPI / Swagger 3** documentation
* **JUnit 5 & Mockito** testing suite

### Frontend
* **React 18 / TypeScript / Vite**
* **Tailwind CSS** with responsive layout and system-aware dark mode
* **Zustand** client state management (persistent auth, theme, notifications)
* **TanStack React Query** for cached server-state fetching
* **React Router v6** with nested protected routes and onboarding guards
* **Recharts** interactive financial visualizations
* **i18next** internationalization runtime
* **Lucide React** icon system
* **Vitest & React Testing Library** test suite

---

## 🚀 Getting Started

### Prerequisites
* **Java JDK 17+**
* **Apache Maven 3.9+**
* **Node.js 18+ & npm**

---

### 1. Running the Backend
From the root directory:
```bash
cd backend
mvn spring-boot:run
```
* **API Base URL**: `http://localhost:8080/api/v1`
* **Swagger UI Documentation**: `http://localhost:8080/swagger-ui.html`
* **H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:budgetbuddy`)

To run backend tests:
```bash
mvn test
```

---

### 2. Running the Frontend
From the root directory:
```bash
cd frontend
npm install
npm run dev
```
* **Frontend Application**: `http://localhost:5173`

To build the frontend for production:
```bash
npm run build
```

To run frontend tests:
```bash
npm test
```

---

## 🔒 Security & Data Integrity Principles

* **No Unregulated Advice**: All AI-driven or algorithmic recommendations carry explicit educational disclaimers.
* **Mathematical Accuracy**: Projections and compound interest calculations use validated, deterministic backend mathematics rather than unbounded LLM generation.
* **Credential Protection**: Passwords are encrypted with BCrypt (strength 12). No credit card numbers, CVVs, or unencrypted personal identification are ever stored.
* **Resilient Graceful Degradation**: Offline/fallback OCR heuristics ensure parsing works even in lightweight environments without native Tesseract binaries.

---

## 📜 License
MIT License. Built for portfolio, educational, and personal empowerment demonstrations.
