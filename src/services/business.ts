/**
 * Business Logic Service
 * Handles calculations, statistics, and business rules
 */

import type { Invoice, Purchase, CustomerPayment, User, DebtReminder } from '../types/index';
import StorageService from './storage';

class BusinessService {
  /**
   * Calculate total debt for a customer
   */
  static calculateCustomerDebt(userId: number): number {
    const invoices = StorageService.getInvoices().filter(i => i.userId === userId);
    const payments = StorageService.getPayments().filter(p => p.userId === userId);

    const totalInvoices = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPayments = payments.reduce((sum, pay) => sum + pay.amount, 0);

    return totalInvoices - totalPayments;
  }

  /**
   * Get customers with debt
   */
  static getCustomersWithDebt(): Array<{ user: User; debt: number; creditLimit?: number; debtPercentage: number }> {
    const customers = StorageService.getUsers().filter(u => u.role === 'customer');
    return customers
      .map(customer => ({
        user: customer,
        debt: this.calculateCustomerDebt(customer.id || 0),
        creditLimit: customer.creditLimit,
        debtPercentage: customer.creditLimit ? (this.calculateCustomerDebt(customer.id || 0) / customer.creditLimit) * 100 : 0,
      }))
      .filter(c => c.debt > 0);
  }

  /**
   * Check if customer is approaching credit limit
   */
  static isApproachingCreditLimit(userId: number, threshold: number = 0.9): boolean {
    const customer = StorageService.getUserById(userId);
    if (!customer || !customer.creditLimit) return false;

    const debt = this.calculateCustomerDebt(userId);
    return debt / customer.creditLimit >= threshold;
  }

  /**
   * Calculate daily sales
   */
  static calculateDailySales(date: string): number {
    return StorageService.getInvoicesByDate(date).reduce((sum, inv) => sum + inv.amount, 0);
  }

  /**
   * Calculate daily purchases
   */
  static calculateDailyPurchases(date: string): number {
    return StorageService.getPurchasesByDate(date).reduce((sum, purch) => sum + purch.amount, 0);
  }

  /**
   * Calculate daily payments
   */
  static calculateDailyPayments(date: string): number {
    return StorageService.getPaymentsByDate(date).reduce((sum, pay) => sum + pay.amount, 0);
  }

  /**
   * Calculate cash sales for a date
   */
  static calculateCashSales(date: string): number {
    return StorageService.getInvoicesByDate(date)
      .filter(inv => inv.paymentMethodId === 1) // Assuming 1 is cash
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  /**
   * Calculate app-based sales for a date
   */
  static calculateAppSales(date: string): number {
    return StorageService.getInvoicesByDate(date)
      .filter(inv => inv.paymentMethodId && inv.paymentMethodId > 1)
      .reduce((sum, inv) => sum + inv.amount, 0);
  }

  /**
   * Calculate cash purchases for a date
   */
  static calculateCashPurchases(date: string): number {
    return StorageService.getPurchasesByDate(date)
      .filter(purch => purch.paymentMethodId === 1)
      .reduce((sum, purch) => sum + purch.amount, 0);
  }

  /**
   * Calculate app purchases for a date
   */
  static calculateAppPurchases(date: string): number {
    return StorageService.getPurchasesByDate(date)
      .filter(purch => purch.paymentMethodId && purch.paymentMethodId > 1)
      .reduce((sum, purch) => sum + purch.amount, 0);
  }

  /**
   * Generate daily statistics
   */
  static generateDailyStatistics(date: string, yesterdayCashInBox: number = 0, todayCashInBox: number = 0) {
    const cashSales = this.calculateCashSales(date);
    const appSales = this.calculateAppSales(date);
    const totalSales = cashSales + appSales;

    const cashPurchases = this.calculateCashPurchases(date);
    const appPurchases = this.calculateAppPurchases(date);
    const totalPurchases = cashPurchases + appPurchases;

    const cashPayments = StorageService.getPaymentsByDate(date)
      .filter(p => p.paymentMethodId === 1)
      .reduce((sum, p) => sum + p.amount, 0);

    const appPayments = StorageService.getPaymentsByDate(date)
      .filter(p => p.paymentMethodId && p.paymentMethodId > 1)
      .reduce((sum, p) => sum + p.amount, 0);

    // Formula: Daily Income = Today's Cash + Today's Debt + Cash Purchases - Yesterday's Cash - Cash Payments
    const dailyIncome = todayCashInBox + (totalSales - cashSales) + cashPurchases - yesterdayCashInBox - cashPayments;

    return {
      statisticDate: date,
      yesterdayCashInBox,
      todayCashInBox,
      dailyCashIncome: dailyIncome,
      totalCashDebtRepayment: cashPayments,
      totalAppDebtRepayment: appPayments,
      totalCashPurchases: cashPurchases,
      totalAppPurchases: appPurchases,
      totalPurchases,
      totalDailySales: totalSales,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Get sales by payment method
   */
  static getSalesByPaymentMethod(date: string): Record<string, number> {
    const invoices = StorageService.getInvoicesByDate(date);
    const methods = StorageService.getPaymentMethods();
    const result: Record<string, number> = {};

    methods.forEach(method => {
      result[method.name] = invoices
        .filter(inv => inv.paymentMethodId === method.id)
        .reduce((sum, inv) => sum + inv.amount, 0);
    });

    return result;
  }

  /**
   * Get purchases by supplier
   */
  static getPurchasesBySupplier(date: string): Record<string, number> {
    const purchases = StorageService.getPurchasesByDate(date);
    const result: Record<string, number> = {};

    purchases.forEach(purchase => {
      result[purchase.supplier] = (result[purchase.supplier] || 0) + purchase.amount;
    });

    return result;
  }

  /**
   * Check for debt reminders needed
   */
  static checkAndCreateDebtReminders(): void {
    const customersWithDebt = this.getCustomersWithDebt();
    const today = new Date().toISOString().split('T')[0];

    customersWithDebt.forEach(({ user, debt, debtPercentage }) => {
      // Check if approaching credit limit (90%)
      if (debtPercentage >= 90 && user.id) {
        const existingReminder = StorageService.getReminders().find(
          r => r.userId === user.id && r.reminderDate === today && !r.isRead
        );

        if (!existingReminder) {
          StorageService.addReminder({
            userId: user.id,
            debtAmount: debt,
            reminderDate: today,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
  }

  /**
   * Get pending reminders
   */
  static getPendingReminders(): DebtReminder[] {
    return StorageService.getReminders().filter(r => !r.isRead);
  }

  /**
   * Calculate average invoice amount
   */
  static calculateAverageInvoiceAmount(date: string): number {
    const invoices = StorageService.getInvoicesByDate(date);
    if (invoices.length === 0) return 0;
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    return total / invoices.length;
  }

  /**
   * Get top customers by sales
   */
  static getTopCustomers(limit: number = 5): Array<{ user: User; totalSales: number }> {
    const customers = StorageService.getUsers().filter(u => u.role === 'customer');
    const customerSales = customers.map(customer => ({
      user: customer,
      totalSales: StorageService.getInvoicesByUser(customer.id || 0).reduce((sum, inv) => sum + inv.amount, 0),
    }));

    return customerSales.sort((a, b) => b.totalSales - a.totalSales).slice(0, limit);
  }

  /**
   * Get top suppliers
   */
  static getTopSuppliers(limit: number = 5): Array<{ supplier: string; totalAmount: number }> {
    const purchases = StorageService.getPurchases();
    const supplierMap: Record<string, number> = {};

    purchases.forEach(purchase => {
      supplierMap[purchase.supplier] = (supplierMap[purchase.supplier] || 0) + purchase.amount;
    });

    return Object.entries(supplierMap)
      .map(([supplier, amount]) => ({ supplier, totalAmount: amount }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  }
}

export default BusinessService;
