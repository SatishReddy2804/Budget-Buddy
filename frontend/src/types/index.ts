export interface ApiResponse<T> {
  timestamp: string;
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  preferredLanguage: string;
  themePreference: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  preferredLanguage: string;
  themePreference: string;
  onboardingCompleted: boolean;
}

export interface UserProfile {
  id?: number;
  employmentStatus: string; // UNEMPLOYED, EMPLOYED, STUDENT, FREELANCER, BUSINESS_OWNER
  currentCity: string;
  state?: string;
  country: string;
  willingToRelocate: boolean;
  educationLevel?: string;
  primarySkills?: string;
  skillsToLearn?: string;
  experienceYears?: number;
  preferredWorkType: string; // REMOTE, HYBRID, ONSITE
  dailyAvailableHours: number;
  weeklyAvailableHours: number;
  riskTolerance: string; // CONSERVATIVE, MODERATE, AGGRESSIVE
  healthAccessibilityNeeds?: string;
  familyCommitments?: string;
}

export interface FinancialProfile {
  id?: number;
  currentMonthlyIncome: number;
  currentSavings: number;
  monthlyEssentialExpenses: number;
  existingDebts?: number;
  targetWealthAmount: number;
  targetDurationYears: number;
  emergencyFundTarget?: number;
  riskComfortLevel?: string;
}

export interface Opportunity {
  id: number;
  category: string;
  title: string;
  description: string;
  whyItMatches?: string;
  requiredCapital: number;
  requiredSkills?: string;
  learningCurveWeeks: number;
  timeToFirstRevenueWeeks: number;
  dailyHoursRequired: number;
  minMonthlyRevenue: number;
  maxMonthlyRevenue: number;
  operatingExpenses: number;
  marketCompetition: string;
  locationType: string;
  riskLevel: string;
  evidenceSources?: string;
  confidenceScore: number;
}

export interface CareerRoadmap {
  id: number;
  title: string;
  overallPhase: string;
  totalPhases: number;
  currentPhase: number;
  startDate: string;
  targetEndDate: string;
  status: string;
  opportunity?: Opportunity;
  milestones: RoadmapMilestone[];
}

export interface RoadmapMilestone {
  id: number;
  phaseNumber: number;
  title: string;
  description?: string;
  targetCompletionDays: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface DailyPlan {
  id: number;
  planDate: string;
  totalAvailableMinutes: number;
  scheduledMinutes: number;
  completedMinutes: number;
  completionPercentage: number;
  isUnavailableDay: boolean;
  unavailableReason?: string;
  status: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  dailyPlanId?: number;
  milestoneId?: number;
  title: string;
  description?: string;
  instructions?: string;
  expectedResult?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  estimatedMinutes: number;
  actualMinutes: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'SKIPPED' | 'RESCHEDULED';
  carryForwardCount: number;
  dueDate: string;
  completedAt?: string;
}

export interface PendingTask {
  id: number;
  originalTaskId: number;
  title: string;
  description?: string;
  priority: string;
  category: string;
  estimatedMinutes: number;
  originalDate: string;
  carriedToDate?: string;
  reason?: string;
  isResolved: boolean;
}

export interface WealthSimulationRequest {
  startingCapital: number;
  currentMonthlyIncome: number;
  monthlyEssentialExpenses: number;
  targetWealthAmount: number;
  targetDurationYears: number;
  expectedAnnualIncomeGrowthRate?: number;
  inflationRate?: number;
}

export interface WealthSimulationResult {
  feasibilityStatus: 'REALISTIC' | 'AMBITIOUS' | 'VERY_AMBITIOUS' | 'NOT_REALISTIC_WITH_CURRENT_INPUTS';
  feasibilityExplanation: string;
  monthlySavingsCapacity: number;
  emergencyReserveNeeded: number;
  financialRunwayMonths: number;
  conservativeScenario: ScenarioProjection;
  moderateScenario: ScenarioProjection;
  ambitiousScenario: ScenarioProjection;
  sensitivityAnalysis: SensitivityItem[];
  educationalDisclaimer: string;
}

export interface ScenarioProjection {
  scenarioName: string;
  assumedAnnualReturnRate: number;
  requiredMonthlyContribution: number;
  monthlyShortfall: number;
  requiredAdditionalIncome: number;
  projectedAccumulatedWealth: number;
  estimatedCompletionYears: number;
  yearlyMilestones: YearlyMilestone[];
}

export interface YearlyMilestone {
  year: number;
  beginningBalance: number;
  annualContribution: number;
  estimatedReturns: number;
  endingBalance: number;
}

export interface SensitivityItem {
  factor: string;
  changeDescription: string;
  revisedProjectedWealth: number;
  outcomeImpact: string;
}

export interface LocationComparison {
  userCity: string;
  willingToRelocate: boolean;
  cityComparisons: CityMetric[];
}

export interface CityMetric {
  cityName: string;
  state: string;
  tier: string;
  averageMonthlyRent: number;
  monthlyLivingCost: number;
  estimatedRelocationCost: number;
  medianEntryTechSalary: number;
  medianSeniorSalary: number;
  projectedNetMonthlySavings: number;
  keyIndustries: string;
  suitabilityReason: string;
  isRemote: boolean;
}

export interface ProgressAnalytics {
  dailyCompletionRate: number;
  weeklyProgressRate: number;
  monthlyProgressRate: number;
  yearlyProgressRate: number;
  currentStreakDays: number;
  longestStreakDays: number;
  missedDaysCount: number;
  totalTasksCompleted: number;
  totalPendingTasks: number;
  heatmap: HeatmapEntry[];
  adjustmentHistory: RescheduleEvent[];
}

export interface HeatmapEntry {
  date: string;
  count: number;
  level: number;
}

export interface RescheduleEvent {
  id: number;
  reasonCategory: string;
  explanation?: string;
  taskCount: number;
  timestamp: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface ParsedReceipt {
  receiptId?: number;
  merchantName: string;
  receiptDate: string;
  totalAmount: number;
  subtotal?: number;
  taxAmount?: number;
  tipAmount?: number;
  currency: string;
  predictedCategory?: string;
  confidence: number;
  rawText?: string;
  lineItems: ReceiptLineItem[];
  warnings: string[];
}

export interface ReceiptLineItem {
  itemName: string;
  quantity: number;
  unitPrice?: number;
  totalPrice: number;
  predictedCategory?: string;
}

export interface Transaction {
  id: number;
  receiptId?: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  type: 'EXPENSE' | 'INCOME';
  amount: number;
  currency: string;
  transactionDate: string;
  merchant: string;
  notes?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  month: number;
  year: number;
  budgetedAmount: number;
  actualSpent: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
}

export interface SpendingSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: {
    categoryName: string;
    color: string;
    totalAmount: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
  topMerchants: {
    merchant: string;
    amount: number;
    transactionCount: number;
  }[];
  recentTransactions: Transaction[];
}

export interface AiInsightResponse {
  title: string;
  summary: string;
  observations: string[];
  recommendedActions: string[];
  educationalDisclaimer: string;
  providerMode: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
