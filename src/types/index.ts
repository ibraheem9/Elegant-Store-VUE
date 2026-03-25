/**
 * Complete Type Definitions for Store Management Application
 * Professional TypeScript interfaces aligned with Flutter implementation
 * Follows SOLID principles and clean code standards
 */

// ============ User & Authentication ============

export interface User {
  id?: number;
  username: string;
  email: string;
  name: string;
  role: 'accountant' | 'manager' | 'customer';
  isPermanentCustomer: boolean;
  creditLimit?: number;
  balance?: number; // Positive balance (credit)
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
  lastLogin?: string;
}

// ============ Payment Methods ============

export interface PaymentMethod {
  id?: number;
  name: string;
  type: 'cash' | 'app' | 'transfer' | 'deferred';
  description?: string;
  isActive: boolean;
  owner?: string; // For app-based payments (Ibrahim, Hamoda, etc.)
  createdAt?: string;
}

// ============ Invoices & Sales ============

export interface Invoice {
  id?: number;
  userId: number;
  invoiceDate: string; // Format: DD-MM-YYYY
  dayName?: string; // Saturday, Sunday, etc.
  amount: number;
  notes?: string;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMethodId?: number;
  createdAt: string;
  updatedAt?: string;
  editHistory?: EditHistory[];
}

export interface EditHistory {
  timestamp: string;
  changedBy: string;
  changes: Record<string, { old: any; new: any }>;
}

// ============ Purchases ============

export interface Purchase {
  id?: number;
  supplier: string;
  amount: number;
  paymentMethodId?: number;
  purchaseDate: string; // Format: DD-MM-YYYY
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============ Payments ============

export interface CustomerPayment {
  id?: number;
  userId: number;
  invoiceId?: number;
  amount: number;
  paymentMethodId?: number;
  paymentDate: string; // Format: DD-MM-YYYY
  createdAt: string;
  updatedAt?: string;
}

// ============ Daily Statistics ============

export interface DailyStatistics {
  id?: number;
  statisticDate: string; // Format: DD-MM-YYYY
  yesterdayCashInBox: number;
  todayCashInBox: number;
  totalCashDebtRepayment: number;
  totalAppDebtRepayment: number;
  totalCashPurchases: number;
  totalAppPurchases: number;
  createdAt: string;
  updatedAt?: string;
}

// ============ Debt Reminders ============

export interface DebtReminder {
  id?: number;
  userId: number;
  debtAmount: number;
  reminderDate: string;
  reminderType: 'daily_debt' | 'credit_limit_warning' | 'overdue';
  isRead: boolean;
  createdAt: string;
}

// ============ Notifications ============

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: string;
}

// ============ Form Inputs ============

export interface SaleFormInput {
  customerName: string;
  customerId?: number;
  amount: number;
  paymentMethod?: string;
  notes?: string;
  phoneNumber?: string;
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

export interface CustomerFormInput {
  name: string;
  creditLimit: number;
  isPermanent: boolean;
  phoneNumber?: string;
  notes?: string;
}

// ============ Reports & Statistics ============

export interface SalesReport {
  totalSales: number;
  totalInvoices: number;
  averageInvoiceAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  partialInvoices: number;
  byPaymentMethod: Record<string, number>;
  byDay: Record<string, number>;
}

export interface PurchaseReport {
  totalPurchases: number;
  averageAmount: number;
  bySupplier: Record<string, number>;
  topSuppliers: Array<{ supplier: string; amount: number; count: number }>;
  byPaymentMethod: Record<string, number>;
}

export interface DebtReport {
  totalDebt: number;
  customersWithDebt: number;
  overdueDebt: number;
  byCustomer: Array<{
    customer: string;
    amount: number;
    creditLimit: number;
    percentageUsed: number;
    daysOverdue: number;
  }>;
  topDebtors: Array<{ customer: string; amount: number }>;
}

export interface CustomerReport {
  totalCustomers: number;
  permanentCustomers: number;
  temporaryCustomers: number;
  topBuyers: Array<{ customer: string; totalSpent: number; invoiceCount: number }>;
  customersWithBalance: number;
}

// ============ Search & Filter ============

export interface SearchParams {
  query: string;
  searchIn: 'name' | 'phone' | 'notes' | 'all';
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface InvoiceFilter {
  dateRange?: DateRange;
  customerId?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============ API Responses ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============ App State ============

export interface AppState {
  users: User[];
  invoices: Invoice[];
  purchases: Purchase[];
  payments: CustomerPayment[];
  paymentMethods: PaymentMethod[];
  statistics: DailyStatistics[];
  reminders: DebtReminder[];
  lastSyncTime?: string;
}

// ============ Validation ============

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============ Enums ============

export enum UserRole {
  ACCOUNTANT = 'accountant',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
}

export enum PaymentType {
  CASH = 'cash',
  APP = 'app',
  TRANSFER = 'transfer',
  DEFERRED = 'deferred',
}

export enum ReminderType {
  DAILY_DEBT = 'daily_debt',
  CREDIT_LIMIT_WARNING = 'credit_limit_warning',
  OVERDUE = 'overdue',
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}
