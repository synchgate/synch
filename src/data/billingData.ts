export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isCurrent?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

export interface ApiCallBreakdown {
  id: string;
  route: 'manual' | 'auto';
  status: 'success' | 'failed';
  timestamp: string;
  cost: number;
}

export interface MonthlyUsage {
  month: string;
  successful: number;
  failed: number;
  cost: number;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    interval: 'month',
    features: ['1,000 Transactions', 'Basic Support', 'Standard Analytics'],
    isCurrent: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 25000,
    interval: 'month',
    features: ['50,000 Transactions', 'Priority Support', 'Advanced Analytics', 'Custom Webhooks'],
    isCurrent: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 150000,
    interval: 'month',
    features: ['Unlimited Transactions', '24/7 Dedicated Support', 'Custom Integration', 'SLA Guarantee'],
    isCurrent: false,
  },
];

export const invoices: Invoice[] = [
  { id: 'INV-2024-001', date: '2024-03-01', amount: 25000, status: 'paid', downloadUrl: '#' },
  { id: 'INV-2024-002', date: '2024-02-01', amount: 25000, status: 'paid', downloadUrl: '#' },
  { id: 'INV-2024-003', date: '2024-01-01', amount: 25000, status: 'paid', downloadUrl: '#' },
  { id: 'INV-2023-125', date: '2023-12-01', amount: 25000, status: 'paid', downloadUrl: '#' },
];

export const monthlyUsage: MonthlyUsage[] = [
  { month: 'Oct', successful: 3200, failed: 120, cost: 32000 },
  { month: 'Nov', successful: 4500, failed: 80, cost: 45000 },
  { month: 'Dec', successful: 5100, failed: 150, cost: 51000 },
  { month: 'Jan', successful: 4800, failed: 90, cost: 48000 },
  { month: 'Feb', successful: 6200, failed: 110, cost: 62000 },
  { month: 'Mar', successful: 7500, failed: 45, cost: 75000 },
];

export const apiCalls: ApiCallBreakdown[] = [
  { id: 'tx_1', route: 'auto', status: 'success', timestamp: '2024-03-15 14:23:01', cost: 15.00 },
  { id: 'tx_2', route: 'manual', status: 'success', timestamp: '2024-03-15 14:20:45', cost: 10.00 },
  { id: 'tx_3', route: 'auto', status: 'failed', timestamp: '2024-03-15 14:15:12', cost: 0.00 },
  { id: 'tx_4', route: 'auto', status: 'success', timestamp: '2024-03-15 14:10:33', cost: 15.00 },
  { id: 'tx_5', route: 'manual', status: 'success', timestamp: '2024-03-15 13:55:21', cost: 10.00 },
  { id: 'tx_6', route: 'auto', status: 'success', timestamp: '2024-03-15 13:45:10', cost: 15.00 },
  { id: 'tx_7', route: 'manual', status: 'success', timestamp: '2024-03-15 13:30:05', cost: 10.00 },
];

export const billingHistory = [
  { date: 'Mar 15, 2024', event: 'Subscription Renewed - Pro Plan', amount: '-₦25,000.00' },
  { date: 'Feb 28, 2024', event: 'Surcharge', amount: '-₦12,500.00' },
  { date: 'Feb 15, 2024', event: 'Subscription Renewed - Pro Plan', amount: '-₦25,000.00' },
  { date: 'Jan 15, 2024', event: 'Subscription Renewed - Pro Plan', amount: '-₦25,000.00' },
  { date: 'Dec 15, 2023', event: 'Subscription Renewed - Pro Plan', amount: '-₦25,000.00' },
];
