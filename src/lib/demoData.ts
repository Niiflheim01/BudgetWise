export const MONTHLY_INCOME = 65000

export const budgetCategories = [
  { id: 'housing', label: 'Housing & Rent', icon: '🏠', allocated: 15000, spent: 15000, color: '#4F46E5' },
  { id: 'utilities', label: 'Utilities', icon: '⚡', allocated: 3500, spent: 2890, color: '#3B82F6' },
  { id: 'food', label: 'Food & Groceries', icon: '🛒', allocated: 10000, spent: 8420, color: '#10B981' },
  { id: 'dining', label: 'Dining Out', icon: '🍜', allocated: 4000, spent: 3850, color: '#F59E0B' },
  { id: 'transportation', label: 'Transportation', icon: '🚌', allocated: 3500, spent: 2100, color: '#6366F1' },
  { id: 'health', label: 'Health & Wellness', icon: '💊', allocated: 2000, spent: 800, color: '#EC4899' },
  { id: 'education', label: 'Education', icon: '📚', allocated: 3000, spent: 3000, color: '#8B5CF6' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', allocated: 2500, spent: 1950, color: '#F97316' },
  { id: 'clothing', label: 'Clothing', icon: '👗', allocated: 2000, spent: 600, color: '#14B8A6' },
  { id: 'savings', label: 'Emergency Fund', icon: '🏦', allocated: 8000, spent: 8000, color: '#10B981' },
  { id: 'investments', label: 'Investments', icon: '📈', allocated: 6000, spent: 6000, color: '#7C3AED' },
  { id: 'debt', label: 'Debt Payments', icon: '💳', allocated: 5500, spent: 5500, color: '#EF4444' },
]

export const totalAllocated = budgetCategories.reduce((s, c) => s + c.allocated, 0)
export const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0)
export const remaining = MONTHLY_INCOME - totalAllocated

export const spendingTrends = [
  { month: 'Jan', actual: 48200, budget: 62000, savings: 13800 },
  { month: 'Feb', actual: 51400, budget: 62000, savings: 10600 },
  { month: 'Mar', actual: 55100, budget: 63000, savings: 7900 },
  { month: 'Apr', actual: 49800, budget: 63000, savings: 13200 },
  { month: 'May', actual: 57200, budget: 65000, savings: 7800 },
  { month: 'Jun', actual: 58110, budget: 65000, savings: 6890 },
]

export const categoryTrends = [
  { month: 'Jan', Food: 8200, Transport: 3100, Entertainment: 1800, Dining: 3200 },
  { month: 'Feb', Food: 9100, Transport: 2800, Entertainment: 2100, Dining: 3600 },
  { month: 'Mar', Food: 8700, Transport: 3200, Entertainment: 2400, Dining: 3900 },
  { month: 'Apr', Food: 8400, Transport: 2500, Entertainment: 1900, Dining: 3400 },
  { month: 'May', Food: 9200, Transport: 2900, Entertainment: 2200, Dining: 3700 },
  { month: 'Jun', Food: 8420, Transport: 2100, Entertainment: 1950, Dining: 3850 },
]

export const recentExpenses = [
  { id: 1, name: 'GrabFood Delivery', category: 'Dining Out', amount: 485, date: '2026-06-23', icon: '🍜' },
  { id: 2, name: 'SM Grocery', category: 'Food & Groceries', amount: 2340, date: '2026-06-22', icon: '🛒' },
  { id: 3, name: 'Meralco Bill', category: 'Utilities', amount: 1890, date: '2026-06-21', icon: '⚡' },
  { id: 4, name: 'Grab Ride', category: 'Transportation', amount: 145, date: '2026-06-21', icon: '🚌' },
  { id: 5, name: 'Netflix Subscription', category: 'Entertainment', amount: 549, date: '2026-06-20', icon: '🎬' },
  { id: 6, name: 'Mercury Drug', category: 'Health & Wellness', amount: 320, date: '2026-06-20', icon: '💊' },
  { id: 7, name: 'Jollibee', category: 'Dining Out', amount: 375, date: '2026-06-19', icon: '🍜' },
  { id: 8, name: 'Cebu Pacific Ticket', category: 'Transportation', amount: 1800, date: '2026-06-18', icon: '✈️' },
]

export const goals = [
  {
    id: 1,
    name: 'Emergency Fund',
    icon: '🏦',
    target: 195000,
    current: 112500,
    monthly: 8000,
    color: '#10B981',
    deadline: '2027-06',
    description: '3 months of living expenses',
    contributions: [3000, 5000, 8000, 8000, 8000, 8000],
  },
  {
    id: 2,
    name: 'New Laptop',
    icon: '💻',
    target: 85000,
    current: 52000,
    monthly: 5000,
    color: '#4F46E5',
    deadline: '2026-12',
    description: 'MacBook Pro for work',
    contributions: [3000, 4000, 5000, 5000, 5000, 5000],
  },
  {
    id: 3,
    name: 'Tuition Fund',
    icon: '🎓',
    target: 120000,
    current: 38000,
    monthly: 6000,
    color: '#F59E0B',
    deadline: '2027-03',
    description: 'MBA Program',
    contributions: [2000, 3000, 4000, 6000, 6000, 6000],
  },
  {
    id: 4,
    name: 'Vacation Fund',
    icon: '✈️',
    target: 45000,
    current: 18500,
    monthly: 3000,
    color: '#3B82F6',
    deadline: '2026-12',
    description: 'Japan Trip with family',
    contributions: [1000, 2000, 2500, 3000, 3000, 3000],
  },
]

export const nudges = [
  {
    id: 1,
    type: 'warning',
    title: 'Dining Budget at Risk',
    message: 'Based on current behavior, you\'ll exceed your Dining Out budget by ₱1,200 in 5 days.',
    action: 'Reduce GrabFood orders by 3 this week.',
    impact: 'Saves ₱1,500 this month',
    category: 'Dining Out',
    urgency: 'high',
    icon: '⚠️',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'positive',
    title: 'Transportation Win!',
    message: 'You\'re 40% below your transportation budget this month. Keep it up!',
    action: 'Redirect ₱1,400 savings to your Laptop goal.',
    impact: 'Reaches goal 2 weeks earlier',
    category: 'Transportation',
    urgency: 'low',
    icon: '🎉',
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    type: 'goal',
    title: 'Laptop Goal On Track',
    message: 'Saving ₱300 more this week keeps your New Laptop goal perfectly on schedule.',
    action: 'Transfer ₱300 to Laptop Fund.',
    impact: 'On target for December 2026',
    category: 'Savings',
    urgency: 'medium',
    icon: '🎯',
    timestamp: '1 day ago',
  },
  {
    id: 4,
    type: 'insight',
    title: 'Monthly Pattern Detected',
    message: 'You tend to overspend on entertainment in the last week of the month (+32% average).',
    action: 'Set a ₱1,000 weekly entertainment cap.',
    impact: 'Saves ₱8,400 annually',
    category: 'Entertainment',
    urgency: 'medium',
    icon: '🔍',
    timestamp: '2 days ago',
  },
  {
    id: 5,
    type: 'positive',
    title: 'Emergency Fund Milestone',
    message: 'You\'re 57% toward your Emergency Fund goal. You\'re ahead of schedule by 3 weeks!',
    action: 'Continue current contribution of ₱8,000/month.',
    impact: 'Goal completion: June 2027',
    category: 'Emergency Fund',
    urgency: 'low',
    icon: '🏆',
    timestamp: '3 days ago',
  },
]

export const aiChatHistory = [
  {
    id: 1,
    role: 'assistant' as const,
    message: 'Hello! I\'m your AI Financial Coach. I can help you analyze your spending, plan your budget, and achieve your financial goals. What would you like to know?',
    timestamp: '10:00 AM',
  },
]

export const FINANCIAL_HEALTH_SCORE = 74

export const healthMetrics = [
  { label: 'Budget Adherence', score: 82, color: '#10B981' },
  { label: 'Savings Rate', score: 71, color: '#4F46E5' },
  { label: 'Goal Progress', score: 68, color: '#3B82F6' },
  { label: 'Debt Management', score: 79, color: '#F59E0B' },
]
