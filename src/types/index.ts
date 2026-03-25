/**
 * Type Definitions for Store Management Application
 * Professional TypeScript interfaces for all data models
 */

// User/Account Types
export interface User {
  id?: number;
  username: string;
  email: string;
  name: string;
  role: 'accountant' | 'manager' | 'customer';
  isPermanentCustomer: boolean;
  creditLimit?: number;
  createdAt: string;
  updatedAt?: string;
}

// Payment Method Types
export interface PaymentMethod {
  id?: number;
  name: string;
  type: 'cash' | 'app' | 'transfer';
  description?: string;
  isActive: boolean;
  owner?: string; // For app-based payments (Ibrahim, Hamoda, etc.)
  createdAt?: string;
}

// Invoice/Sales Types
export interface Invoice {
  id?: number;
  userId: number;
  invoiceDate: string;
  amount: number;
  notes?: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMethodId?: number;
  createdAt: string;
  updatedAt?: string;
}

// Purchase Types
export interface Purchase {
  id?: number;
  supplier: string;
  amount: number;
  paymentMethodId?: number;
  purchaseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Daily Statistics Types
export interface DailyStatistics {
  id?: number;
  statisticDate: string;
  yesterdayCashInBox: number;
  todayCashInBox: number;
  dailyCashIncome: number;
  totalCashDebtRepayment: number;
  totalAppDebtRepayment: number;
  totalCashPurchases: number;
  totalAppPurchases: number;
  totalPurchases: number;
  totalDailySales: number;
  createdAt: string;
  updatedAt?: string;
}

// Customer Payment Types
export interface CustomerPayment {
  id?: number;
  userId: number;
  invoiceId?: number;
  amount: number;
  paymentMethodId?: number;
  paymentDate: string;
  createdAt: string;
  updatedAt?: string;
}

// Debt Reminder Types
export interface DebtReminder {
  id?: number;
  userId: number;
  debtAmount: number;
  reminderDate: string;
  isRead: boolean;
  createdAt: string;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

// App State Types
export interface AppState {
  users: User[];
  invoices: Invoice[];
  purchases: Purchase[];
  payments: CustomerPayment[];
  paymentMethods: PaymentMethod[];
  statistics: DailyStatistics[];
  reminders: DebtReminder[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Input Types
export interface SaleFormInput {
  customerName: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export interface PurchaseFormInput {
  supplier: string;
  amount: number;
  paymentMethod?: string;
  notes?: string;
}

export interface PaymentFormInput {
  customerId: number;
  amount: number;
  paymentMethod: string;
  invoiceId?: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter Types
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SalesFilter {
  dateRange?: DateRange;
  customerId?: number;
  paymentStatus?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Report Types
export interface SalesReport {
  totalSales: number;
  totalInvoices: number;
  averageInvoiceAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  byPaymentMethod: Record<string, number>;
}

export interface PurchaseReport {
  totalPurchases: number;
  averagePurchaseAmount: number;
  bySupplier: Record<string, number>;
  topSuppliers: Array<{ supplier: string; amount: number }>;
}

export interface DebtReport {
  totalDebt: number;
  customersWithDebt: number;
  overdueDebt: number;
  byCustomer: Array<{ customer: string; amount: number; daysOverdue: number }>;
}
