-- Seed data for Default Categories and Opportunities

-- Default Expense Categories
INSERT INTO expense_categories (id, user_id, name, icon, color, is_default, created_at) VALUES
(1, NULL, 'Food & Dining', 'utensils', '#f97316', TRUE, CURRENT_TIMESTAMP),
(2, NULL, 'Groceries', 'shopping-cart', '#10b981', TRUE, CURRENT_TIMESTAMP),
(3, NULL, 'Transport & Fuel', 'car', '#3b82f6', TRUE, CURRENT_TIMESTAMP),
(4, NULL, 'Housing & Rent', 'home', '#8b5cf6', TRUE, CURRENT_TIMESTAMP),
(5, NULL, 'Utilities & Bills', 'zap', '#eab308', TRUE, CURRENT_TIMESTAMP),
(6, NULL, 'Education & Books', 'book-open', '#06b6d4', TRUE, CURRENT_TIMESTAMP),
(7, NULL, 'Healthcare & Medical', 'heart-pulse', '#ef4444', TRUE, CURRENT_TIMESTAMP),
(8, NULL, 'Entertainment & Leisure', 'film', '#ec4899', TRUE, CURRENT_TIMESTAMP),
(9, NULL, 'Shopping & Personal', 'shopping-bag', '#6366f1', TRUE, CURRENT_TIMESTAMP),
(10, NULL, 'Investments & Savings', 'trending-up', '#14b8a6', TRUE, CURRENT_TIMESTAMP),
(11, NULL, 'Other / Miscellaneous', 'more-horizontal', '#64748b', TRUE, CURRENT_TIMESTAMP);

-- Verified Realistic Income Opportunities (PEACE Module)
INSERT INTO opportunities (category, title, description, why_it_matches, required_capital, required_skills, learning_curve_weeks, time_to_first_revenue_weeks, daily_hours_required, min_monthly_revenue, max_monthly_revenue, operating_expenses, market_competition, location_type, risk_level, evidence_sources, confidence_score) VALUES
('AI_SERVICES', 'AI Workflow & Automation Specialist', 'Build custom automated workflows using Zapier, Make, and LLM APIs for small businesses to automate CRM, lead triage, and email operations.', 'High market demand from non-technical businesses needing prompt operations without hiring full-time developers.', 2000.00, 'Prompt Engineering, Zapier/Make, REST APIs, Basic JavaScript/Python', 6, 8, 3.5, 25000.00, 80000.00, 1500.00, 'MEDIUM', 'REMOTE', 'LOW', 'Freelancer platforms, SMB tech adoption surveys 2024-2026', 0.90),

('SOFTWARE_SERVICES', 'Full-Stack Web Development & Maintenance', 'Develop responsive websites, web portals, and micro-SaaS interfaces for regional businesses, clinics, and educational institutes.', 'Consistent demand for modernizing legacy business websites and digitizing local merchant catalogs.', 5000.00, 'React, TypeScript, Spring Boot or Node.js, SQL, Tailwind CSS', 12, 12, 4.0, 35000.00, 120000.00, 2000.00, 'MEDIUM', 'HYBRID', 'LOW', 'NASSCOM SME digitalization reports, Upwork demand indices', 0.92),

('DIGITAL_MARKETING', 'Performance Marketing & SEO Management', 'Manage organic Google SEO, local Maps optimization, and Google/Meta ad campaigns for localized stores and e-commerce brands.', 'Provides direct measurable ROI to business owners, leading to long-term retainer engagements.', 1500.00, 'SEO Auditing, Meta Ads, Google Ads, Analytics, Copywriting', 8, 10, 3.0, 20000.00, 75000.00, 1200.00, 'HIGH', 'REMOTE', 'LOW', 'Digital Agency Benchmark Reports 2024-2025', 0.88),

('REMOTE_EMPLOYMENT', 'Technical Support & Cloud Operations Associate', 'Provide Tier-1/Tier-2 cloud infrastructure support, ticketing resolution, and basic Linux server monitoring for distributed tech companies.', 'Clear pathway to enterprise cloud engineering with steady predictable monthly compensation.', 0.00, 'Linux CLI, Basic AWS/GCP, Networking fundamentals, Customer empathy', 10, 14, 6.0, 30000.00, 60000.00, 500.00, 'MEDIUM', 'REMOTE', 'LOW', 'Remote work placement data & tech support salary benchmarks', 0.91),

('FREELANCING', 'Technical Content Writing & Documentation Specialist', 'Produce high-quality technical blog posts, API documentation, developer guides, and case studies for B2B SaaS companies.', 'Companies frequently outsource documentation and developer advocacy content to knowledgeable specialists.', 500.00, 'Markdown, Technical Research, Clear Writing, Basic Git & Coding', 4, 6, 2.5, 18000.00, 55000.00, 400.00, 'MEDIUM', 'REMOTE', 'LOW', 'Content Marketing Institute developer marketing surveys', 0.89),

('LOCAL_SERVICES', 'Digital Accounting & GST Compliance Consultant', 'Assist local micro-enterprises and shopkeepers with cloud accounting setup (Tally/Zoho Books), invoice digitization, and monthly tax filing.', 'Local offline merchants need trustworthy, hands-on digital assistance to keep GST compliance seamless.', 3000.00, 'TallyPrime, Zoho Books, GST Basics, Income Tax filing basics', 8, 8, 3.0, 15000.00, 45000.00, 800.00, 'LOW', 'ONSITE', 'LOW', 'MSME compliance audit reports', 0.94),

('CONSULTING_TUTORING', 'Online Coding & STEM Educator', 'Conduct live small-group tutoring sessions in foundational programming (Python, Scratch, Java, Web Development) for school and college students.', 'Parents and aspiring graduates invest heavily in structured mentored learning with personalized doubt clearing.', 1000.00, 'Java or Python, Curriculum Design, Engaging Pedagogy, Zoom/Meet', 4, 4, 2.5, 20000.00, 65000.00, 600.00, 'MEDIUM', 'REMOTE', 'LOW', 'EdTech educator hiring data and independent tutor metrics', 0.93),

('SKILL_MONETIZATION', 'UI/UX Design & Prototyping for Mobile Apps', 'Design mobile app interfaces, web UI design systems, and Figma prototypes for early-stage startup founders and agencies.', 'Startup founders need pitch-ready UI prototypes before building MVP software.', 2500.00, 'Figma, Design Systems, Mobile UI Guidelines, Prototyping', 8, 10, 3.5, 25000.00, 85000.00, 1000.00, 'HIGH', 'REMOTE', 'LOW', 'Figma Community data, design agency contractor rates', 0.87);
