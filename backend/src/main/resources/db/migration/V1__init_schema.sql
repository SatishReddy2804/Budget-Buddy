-- Budget Buddy Database Schema V1
-- Supports MySQL 8.4 LTS and H2 MySQL Mode

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    theme_preference VARCHAR(20) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    employment_status VARCHAR(50) NOT NULL,
    current_city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    willing_to_relocate BOOLEAN NOT NULL DEFAULT FALSE,
    education_level VARCHAR(100),
    primary_skills TEXT,
    skills_to_learn TEXT,
    experience_years INT DEFAULT 0,
    preferred_work_type VARCHAR(50) DEFAULT 'REMOTE',
    daily_available_hours DECIMAL(4,1) NOT NULL DEFAULT 4.0,
    weekly_available_hours DECIMAL(4,1) NOT NULL DEFAULT 20.0,
    risk_tolerance VARCHAR(50) DEFAULT 'MODERATE',
    health_accessibility_needs TEXT,
    family_commitments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS financial_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    current_monthly_income DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    current_savings DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    monthly_essential_expenses DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    existing_debts DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    target_wealth_amount DECIMAL(12,2) NOT NULL DEFAULT 1000000.00,
    target_duration_years INT NOT NULL DEFAULT 3,
    emergency_fund_target DECIMAL(12,2) DEFAULT 0.00,
    risk_comfort_level VARCHAR(50) DEFAULT 'MODERATE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_financial_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS opportunities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    why_it_matches TEXT,
    required_capital DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    required_skills TEXT,
    learning_curve_weeks INT NOT NULL DEFAULT 4,
    time_to_first_revenue_weeks INT NOT NULL DEFAULT 8,
    daily_hours_required DECIMAL(4,1) NOT NULL DEFAULT 3.0,
    min_monthly_revenue DECIMAL(12,2) NOT NULL DEFAULT 10000.00,
    max_monthly_revenue DECIMAL(12,2) NOT NULL DEFAULT 50000.00,
    operating_expenses DECIMAL(12,2) NOT NULL DEFAULT 1000.00,
    market_competition VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    location_type VARCHAR(50) NOT NULL DEFAULT 'REMOTE',
    risk_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
    evidence_sources TEXT,
    confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.85,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_roadmaps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    opportunity_id BIGINT,
    title VARCHAR(255) NOT NULL,
    overall_phase VARCHAR(100) NOT NULL DEFAULT 'FOUNDATION',
    total_phases INT NOT NULL DEFAULT 5,
    current_phase INT NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    target_end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    phase_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_completion_days INT NOT NULL DEFAULT 14,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_milestone_roadmap FOREIGN KEY (roadmap_id) REFERENCES career_roadmaps(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_date DATE NOT NULL,
    total_available_minutes INT NOT NULL DEFAULT 240,
    scheduled_minutes INT NOT NULL DEFAULT 240,
    completed_minutes INT NOT NULL DEFAULT 0,
    completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_unavailable_day BOOLEAN NOT NULL DEFAULT FALSE,
    unavailable_reason VARCHAR(100) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_plan_date UNIQUE (user_id, plan_date),
    CONSTRAINT fk_plan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    daily_plan_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    milestone_id BIGINT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    expected_result TEXT,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    category VARCHAR(50) NOT NULL, -- MORNING_FOCUS, SKILL_LEARNING, INCOME_TASK, CLIENT_OUTREACH, SAVINGS_ACTION, HEALTH_ACTION, REVIEW_TASK
    estimated_minutes INT NOT NULL DEFAULT 30,
    actual_minutes INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED, PENDING, SKIPPED, RESCHEDULED
    carry_forward_count INT NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_plan FOREIGN KEY (daily_plan_id) REFERENCES daily_plans(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    original_task_id BIGINT NOT NULL,
    original_date DATE NOT NULL,
    carried_to_date DATE NULL,
    reason VARCHAR(100) NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pending_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pending_task FOREIGN KEY (original_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rescheduling_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    reason_category VARCHAR(100) NOT NULL,
    explanation TEXT,
    rescheduled_task_count INT NOT NULL DEFAULT 0,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reschedule_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expense_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL, -- NULL means global default
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'tag',
    color VARCHAR(20) DEFAULT '#3b82f6',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    stored_file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    ocr_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    raw_ocr_text LONGTEXT NULL,
    ocr_confidence DECIMAL(5,2) DEFAULT 0.00,
    merchant_name VARCHAR(255) NULL,
    receipt_date DATE NULL,
    total_amount DECIMAL(12,2) NULL,
    subtotal DECIMAL(12,2) NULL,
    tax_amount DECIMAL(12,2) NULL,
    tip_amount DECIMAL(12,2) NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receipt_line_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(8,2) DEFAULT 1.0,
    unit_price DECIMAL(12,2) NULL,
    total_price DECIMAL(12,2) NOT NULL,
    predicted_category VARCHAR(100) NULL,
    CONSTRAINT fk_item_receipt FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    receipt_id BIGINT NULL,
    category_id BIGINT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'EXPENSE', -- EXPENSE, INCOME
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    transaction_date DATE NOT NULL,
    merchant VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_trans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_trans_receipt FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE SET NULL,
    CONSTRAINT fk_trans_cat FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    budgeted_amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_cat_month_year UNIQUE (user_id, category_id, month, year),
    CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_budget_cat FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_trans_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_user_tasks_due ON tasks(user_id, due_date, status);
CREATE INDEX idx_user_receipts ON receipts(user_id, status);
