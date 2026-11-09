package com.budgetbuddy.platform.common;

import com.budgetbuddy.platform.expense.model.ExpenseCategory;
import com.budgetbuddy.platform.expense.repository.ExpenseCategoryRepository;
import com.budgetbuddy.platform.peace.model.Opportunity;
import com.budgetbuddy.platform.peace.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ExpenseCategoryRepository categoryRepository;
    private final OpportunityRepository opportunityRepository;

    @Override
    public void run(String... args) {
        seedCategoriesIfEmpty();
        seedOpportunitiesIfEmpty();
    }

    private void seedCategoriesIfEmpty() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding default expense categories into database...");
            List<ExpenseCategory> defaultCategories = List.of(
                    createCat("Food & Dining", "utensils", "#f97316"),
                    createCat("Groceries", "shopping-cart", "#10b981"),
                    createCat("Transport & Fuel", "car", "#3b82f6"),
                    createCat("Housing & Rent", "home", "#8b5cf6"),
                    createCat("Utilities & Bills", "zap", "#eab308"),
                    createCat("Education & Books", "book-open", "#06b6d4"),
                    createCat("Healthcare & Medical", "heart-pulse", "#ef4444"),
                    createCat("Entertainment & Leisure", "film", "#ec4899"),
                    createCat("Shopping & Personal", "shopping-bag", "#6366f1"),
                    createCat("Investments & Savings", "trending-up", "#14b8a6"),
                    createCat("Other / Miscellaneous", "more-horizontal", "#64748b")
            );
            categoryRepository.saveAll(defaultCategories);
            log.info("Successfully seeded {} expense categories.", defaultCategories.size());
        }
    }

    private ExpenseCategory createCat(String name, String icon, String color) {
        ExpenseCategory cat = new ExpenseCategory();
        cat.setName(name);
        cat.setIcon(icon);
        cat.setColor(color);
        cat.setDefault(true);
        cat.setUser(null);
        cat.setCreatedAt(Instant.now());
        return cat;
    }

    private void seedOpportunitiesIfEmpty() {
        if (opportunityRepository.count() == 0) {
            log.info("Seeding default PEACE career opportunities into database...");
            List<Opportunity> list = List.of(
                    createOpp("AI_SERVICES", "AI Workflow & Automation Specialist",
                            "Build custom automated workflows using Zapier, Make, and LLM APIs for small businesses to automate CRM, lead triage, and email operations.",
                            "High market demand from non-technical businesses needing prompt operations without hiring full-time developers.",
                            2000.0, "Prompt Engineering, Zapier/Make, REST APIs, Basic JavaScript/Python", 6, 8, 3.5,
                            25000.0, 80000.0, 1500.0, "MEDIUM", "REMOTE", "LOW",
                            "Freelancer platforms, SMB tech adoption surveys 2024-2026", 0.90),

                    createOpp("SOFTWARE_SERVICES", "Full-Stack Web Development & Maintenance",
                            "Develop responsive websites, web portals, and micro-SaaS interfaces for regional businesses, clinics, and educational institutes.",
                            "Consistent demand for modernizing legacy business websites and digitizing local merchant catalogs.",
                            5000.0, "React, TypeScript, Spring Boot or Node.js, SQL, Tailwind CSS", 12, 12, 4.0,
                            35000.0, 120000.0, 2000.0, "MEDIUM", "HYBRID", "LOW",
                            "NASSCOM SME digitalization reports, Upwork demand indices", 0.92),

                    createOpp("DIGITAL_MARKETING", "Performance Marketing & SEO Management",
                            "Manage organic Google SEO, local Maps optimization, and Google/Meta ad campaigns for localized stores and e-commerce brands.",
                            "Provides direct measurable ROI to business owners, leading to long-term retainer engagements.",
                            1500.0, "SEO Auditing, Meta Ads, Google Ads, Analytics, Copywriting", 8, 10, 3.0,
                            20000.0, 75000.0, 1200.0, "HIGH", "REMOTE", "LOW",
                            "Digital Agency Benchmark Reports 2024-2025", 0.88),

                    createOpp("REMOTE_EMPLOYMENT", "Technical Support & Cloud Operations Associate",
                            "Provide Tier-1/Tier-2 cloud infrastructure support, ticketing resolution, and basic Linux server monitoring for distributed tech companies.",
                            "Clear pathway to enterprise cloud engineering with steady predictable monthly compensation.",
                            0.0, "Linux CLI, Basic AWS/GCP, Networking fundamentals, Customer empathy", 10, 14, 6.0,
                            30000.0, 60000.0, 500.0, "MEDIUM", "REMOTE", "LOW",
                            "Remote work placement data & tech support salary benchmarks", 0.91),

                    createOpp("FREELANCING", "Technical Content Writing & Documentation Specialist",
                            "Produce high-quality technical blog posts, API documentation, developer guides, and case studies for B2B SaaS companies.",
                            "Companies frequently outsource documentation and developer advocacy content to knowledgeable specialists.",
                            500.0, "Markdown, Technical Research, Clear Writing, Basic Git & Coding", 4, 6, 2.5,
                            18000.0, 55000.0, 400.0, "MEDIUM", "REMOTE", "LOW",
                            "Content Marketing Institute developer marketing surveys", 0.89),

                    createOpp("LOCAL_SERVICES", "Digital Accounting & GST Compliance Consultant",
                            "Assist local micro-enterprises and shopkeepers with cloud accounting setup (Tally/Zoho Books), invoice digitization, and monthly tax filing.",
                            "Local offline merchants need trustworthy, hands-on digital assistance to keep GST compliance seamless.",
                            3000.0, "TallyPrime, Zoho Books, GST Basics, Income Tax filing basics", 8, 8, 3.0,
                            15000.0, 45000.0, 800.0, "LOW", "ONSITE", "LOW",
                            "MSME compliance audit reports", 0.94),

                    createOpp("CONSULTING_TUTORING", "Online Coding & STEM Educator",
                            "Conduct live small-group tutoring sessions in foundational programming (Python, Scratch, Java, Web Development) for school and college students.",
                            "Parents and aspiring graduates invest heavily in structured mentored learning with personalized doubt clearing.",
                            1000.0, "Java or Python, Curriculum Design, Engaging Pedagogy, Zoom/Meet", 4, 4, 2.5,
                            20000.0, 65000.0, 600.0, "MEDIUM", "REMOTE", "LOW",
                            "EdTech educator hiring data and independent tutor metrics", 0.93),

                    createOpp("SKILL_MONETIZATION", "UI/UX Design & Prototyping for Mobile Apps",
                            "Design mobile app interfaces, web UI design systems, and Figma prototypes for early-stage startup founders and agencies.",
                            "Startup founders need pitch-ready UI prototypes before building MVP software.",
                            2500.0, "Figma, Design Systems, Mobile UI Guidelines, Prototyping", 8, 10, 3.5,
                            25000.0, 85000.0, 1000.0, "HIGH", "REMOTE", "LOW",
                            "Figma Community data, design agency contractor rates", 0.87)
            );
            opportunityRepository.saveAll(list);
            log.info("Successfully seeded {} opportunities.", list.size());
        }
    }

    private Opportunity createOpp(String category, String title, String description, String whyItMatches,
                                  double requiredCapital, String requiredSkills, int learningCurveWeeks,
                                  int timeToFirstRevenueWeeks, double dailyHoursRequired,
                                  double minMonthlyRevenue, double maxMonthlyRevenue, double operatingExpenses,
                                  String marketCompetition, String locationType, String riskLevel,
                                  String evidenceSources, double confidenceScore) {
        Opportunity opp = new Opportunity();
        opp.setCategory(category);
        opp.setTitle(title);
        opp.setDescription(description);
        opp.setWhyItMatches(whyItMatches);
        opp.setRequiredCapital(BigDecimal.valueOf(requiredCapital));
        opp.setRequiredSkills(requiredSkills);
        opp.setLearningCurveWeeks(learningCurveWeeks);
        opp.setTimeToFirstRevenueWeeks(timeToFirstRevenueWeeks);
        opp.setDailyHoursRequired(BigDecimal.valueOf(dailyHoursRequired));
        opp.setMinMonthlyRevenue(BigDecimal.valueOf(minMonthlyRevenue));
        opp.setMaxMonthlyRevenue(BigDecimal.valueOf(maxMonthlyRevenue));
        opp.setOperatingExpenses(BigDecimal.valueOf(operatingExpenses));
        opp.setMarketCompetition(marketCompetition);
        opp.setLocationType(locationType);
        opp.setRiskLevel(riskLevel);
        opp.setEvidenceSources(evidenceSources);
        opp.setConfidenceScore(BigDecimal.valueOf(confidenceScore));
        opp.setCreatedAt(Instant.now());
        return opp;
    }
}
