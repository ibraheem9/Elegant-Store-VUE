/**
 * LocalStorage Service
 * Handles all data persistence with localStorage
 * Professional implementation with error handling
 */

import type {
  User,
  Invoice,
  Purchase,
  PaymentMethod,
  CustomerPayment,
  DebtReminder,
  DailyStatistics,
} from '../types/index';

const STORAGE_KEYS = {
  USERS: 'store_users',
  INVOICES: 'store_invoices',
  PURCHASES: 'store_purchases',
  PAYMENTS: 'store_payments',
  PAYMENT_METHODS: 'store_payment_methods',
  REMINDERS: 'store_reminders',
  STATISTICS: 'store_statistics',
  CURRENT_USER: 'store_current_user',
  LAST_SYNC: 'store_last_sync',
};

class StorageService {
  /**
   * Initialize storage with dummy data if empty
   */
  static initializeDummyData(): void {
    if (!this.getUsers().length) {
      this.setUsers(this.generateDummyUsers());
    }
    if (!this.getPaymentMethods().length) {
      this.setPaymentMethods(this.generateDummyPaymentMethods());
    }
    if (!this.getInvoices().length) {
      this.setInvoices(this.generateDummyInvoices());
    }
    if (!this.getPurchases().length) {
      this.setPurchases(this.generateDummyPurchases());
    }
    if (!this.getPayments().length) {
      this.setPayments(this.generateDummyPayments());
    }
  }

  // ============ Users Management ============

  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  static setUsers(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  static addUser(user: User): void {
    const users = this.getUsers();
    user.id = Math.max(...users.map(u => u.id || 0), 0) + 1;
    user.createdAt = new Date().toISOString();
    users.push(user);
    this.setUsers(users);
  }

  static updateUser(id: number, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      this.setUsers(users);
    }
  }

  static getUserById(id: number): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username === username);
  }

  // ============ Invoices Management ============

  static getInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading invoices:', error);
      return [];
    }
  }

  static setInvoices(invoices: Invoice[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  }

  static addInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    invoice.id = Math.max(...invoices.map(i => i.id || 0), 0) + 1;
    invoice.createdAt = new Date().toISOString();
    invoices.push(invoice);
    this.setInvoices(invoices);
  }

  static updateInvoice(id: number, updates: Partial<Invoice>): void {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...updates, updatedAt: new Date().toISOString() };
      this.setInvoices(invoices);
    }
  }

  static deleteInvoice(id: number): void {
    const invoices = this.getInvoices();
    this.setInvoices(invoices.filter(i => i.id !== id));
  }

  static getInvoicesByDate(date: string): Invoice[] {
    return this.getInvoices().filter(i => i.invoiceDate === date);
  }

  static getInvoicesByUser(userId: number): Invoice[] {
    return this.getInvoices().filter(i => i.userId === userId);
  }

  // ============ Purchases Management ============

  static getPurchases(): Purchase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading purchases:', error);
      return [];
    }
  }

  static setPurchases(purchases: Purchase[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    } catch (error) {
      console.error('Error saving purchases:', error);
    }
  }

  static addPurchase(purchase: Purchase): void {
    const purchases = this.getPurchases();
    purchase.id = Math.max(...purchases.map(p => p.id || 0), 0) + 1;
    purchase.createdAt = new Date().toISOString();
    purchases.push(purchase);
    this.setPurchases(purchases);
  }

  static deletePurchase(id: number): void {
    const purchases = this.getPurchases();
    this.setPurchases(purchases.filter(p => p.id !== id));
  }

  static getPurchasesByDate(date: string): Purchase[] {
    return this.getPurchases().filter(p => p.purchaseDate === date);
  }

  // ============ Payments Management ============

  static getPayments(): CustomerPayment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading payments:', error);
      return [];
    }
  }

  static setPayments(payments: CustomerPayment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (error) {
      console.error('Error saving payments:', error);
    }
  }

  static addPayment(payment: CustomerPayment): void {
    const payments = this.getPayments();
    payment.id = Math.max(...payments.map(p => p.id || 0), 0) + 1;
    payment.createdAt = new Date().toISOString();
    payments.push(payment);
    this.setPayments(payments);
  }

  static getPaymentsByDate(date: string): CustomerPayment[] {
    return this.getPayments().filter(p => p.paymentDate === date);
  }

  // ============ Payment Methods Management ============

  static getPaymentMethods(): PaymentMethod[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading payment methods:', error);
      return [];
    }
  }

  static setPaymentMethods(methods: PaymentMethod[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods));
    } catch (error) {
      console.error('Error saving payment methods:', error);
    }
  }

  static addPaymentMethod(method: PaymentMethod): void {
    const methods = this.getPaymentMethods();
    method.id = Math.max(...methods.map(m => m.id || 0), 0) + 1;
    methods.push(method);
    this.setPaymentMethods(methods);
  }

  // ============ Debt Reminders Management ============

  static getReminders(): DebtReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading reminders:', error);
      return [];
    }
  }

  static setReminders(reminders: DebtReminder[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  }

  static addReminder(reminder: DebtReminder): void {
    const reminders = this.getReminders();
    reminder.id = Math.max(...reminders.map(r => r.id || 0), 0) + 1;
    reminder.createdAt = new Date().toISOString();
    reminders.push(reminder);
    this.setReminders(reminders);
  }

  static markReminderAsRead(id: number): void {
    const reminders = this.getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      reminder.isRead = true;
      this.setReminders(reminders);
    }
  }

  // ============ Authentication ============

  static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading current user:', error);
      return null;
    }
  }

  static setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // ============ Dummy Data Generation ============

  private static generateDummyUsers(): User[] {
    const today = new Date().toISOString();
    return [
      {
        id: 1,
        username: 'hamoda',
        email: 'hamoda@store.com',
        name: 'محمد ياغي (حمودة)',
        role: 'accountant',
        isPermanentCustomer: false,
        createdAt: today,
      },
      {
        id: 2,
        username: 'abdelhadi',
        email: 'abdelhadi@store.com',
        name: 'محمد عبد الهادي (الدج)',
        role: 'accountant',
        isPermanentCustomer: false,
        createdAt: today,
      },
      {
        id: 3,
        username: 'ahmad',
        email: 'ahmad@store.com',
        name: 'أحمد ياغي',
        role: 'accountant',
        isPermanentCustomer: false,
        createdAt: today,
      },
      {
        id: 4,
        username: 'ibrahim',
        email: 'ibrahim@store.com',
        name: 'إبراهيم عبد الهادي',
        role: 'manager',
        isPermanentCustomer: false,
        createdAt: today,
      },
      // Customers
      {
        id: 5,
        username: 'customer1',
        email: 'customer1@store.com',
        name: 'أحمد علي',
        role: 'customer',
        isPermanentCustomer: true,
        creditLimit: 500,
        createdAt: today,
      },
      {
        id: 6,
        username: 'customer2',
        email: 'customer2@store.com',
        name: 'فاطمة محمد',
        role: 'customer',
        isPermanentCustomer: true,
        creditLimit: 300,
        createdAt: today,
      },
      {
        id: 7,
        username: 'customer3',
        email: 'customer3@store.com',
        name: 'علي حسن',
        role: 'customer',
        isPermanentCustomer: true,
        creditLimit: 200,
        createdAt: today,
      },
    ];
  }

  private static generateDummyPaymentMethods(): PaymentMethod[] {
    return [
      { id: 1, name: 'نقدي', type: 'cash', isActive: true },
      { id: 2, name: 'تطبيق إبراهيم', type: 'app', owner: 'Ibrahim', isActive: true },
      { id: 3, name: 'تطبيق حمودة', type: 'app', owner: 'Hamoda', isActive: true },
      { id: 4, name: 'تطبيق محمود', type: 'app', owner: 'Mahmoud', isActive: true },
      { id: 5, name: 'تطبيق أحمد', type: 'app', owner: 'Ahmad', isActive: true },
      { id: 6, name: 'تطبيق الدج', type: 'app', owner: 'Aldaj', isActive: true },
      { id: 7, name: 'تطبيق عمر', type: 'app', owner: 'Omar', isActive: true },
    ];
  }

  private static generateDummyInvoices(): Invoice[] {
    const today = new Date();
    return [
      {
        id: 1,
        userId: 5,
        invoiceDate: today.toISOString().split('T')[0],
        amount: 150,
        paymentStatus: 'paid',
        paymentMethodId: 1,
        createdAt: today.toISOString(),
      },
      {
        id: 2,
        userId: 6,
        invoiceDate: today.toISOString().split('T')[0],
        amount: 200,
        paymentStatus: 'pending',
        createdAt: today.toISOString(),
      },
      {
        id: 3,
        userId: 7,
        invoiceDate: today.toISOString().split('T')[0],
        amount: 100,
        paymentStatus: 'partial',
        createdAt: today.toISOString(),
      },
    ];
  }

  private static generateDummyPurchases(): Purchase[] {
    const today = new Date();
    return [
      {
        id: 1,
        supplier: 'المورد الأول',
        amount: 500,
        paymentMethodId: 1,
        purchaseDate: today.toISOString().split('T')[0],
        createdAt: today.toISOString(),
      },
      {
        id: 2,
        supplier: 'المورد الثاني',
        amount: 300,
        paymentMethodId: 1,
        purchaseDate: today.toISOString().split('T')[0],
        createdAt: today.toISOString(),
      },
    ];
  }

  private static generateDummyPayments(): CustomerPayment[] {
    const today = new Date();
    return [
      {
        id: 1,
        userId: 5,
        invoiceId: 1,
        amount: 150,
        paymentMethodId: 1,
        paymentDate: today.toISOString().split('T')[0],
        createdAt: today.toISOString(),
      },
    ];
  }

  // ============ Utility Methods ============

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData(): Record<string, any> {
    return {
      users: this.getUsers(),
      invoices: this.getInvoices(),
      purchases: this.getPurchases(),
      payments: this.getPayments(),
      paymentMethods: this.getPaymentMethods(),
      reminders: this.getReminders(),
      exportDate: new Date().toISOString(),
    };
  }

  static importData(data: Record<string, any>): void {
    if (data.users) this.setUsers(data.users);
    if (data.invoices) this.setInvoices(data.invoices);
    if (data.purchases) this.setPurchases(data.purchases);
    if (data.payments) this.setPayments(data.payments);
    if (data.paymentMethods) this.setPaymentMethods(data.paymentMethods);
    if (data.reminders) this.setReminders(data.reminders);
  }
}

export default StorageService;
