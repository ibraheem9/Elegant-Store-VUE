/**
 * Professional LocalStorage Service
 * Comprehensive data persistence with CRUD operations, validation, and error handling
 * Follows SOLID principles and clean code standards
 */

import type {
  User,
  Invoice,
  Purchase,
  PaymentMethod,
  CustomerPayment,
  DebtReminder,
  DailyStatistics,
  EditHistory,
} from '../types/index';

const STORAGE_KEYS = {
  USERS: 'store_users_v1',
  INVOICES: 'store_invoices_v1',
  PURCHASES: 'store_purchases_v1',
  PAYMENTS: 'store_payments_v1',
  PAYMENT_METHODS: 'store_payment_methods_v1',
  REMINDERS: 'store_reminders_v1',
  STATISTICS: 'store_statistics_v1',
  CURRENT_USER: 'store_current_user_v1',
  LAST_SYNC: 'store_last_sync',
  APP_STATE: 'store_app_state_v1',
};

class StorageService {
  /**
   * Initialize storage with dummy data if empty
   */
  static initializeDummyData(): void {
    try {
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
    } catch (error) {
      console.error('Error initializing dummy data:', error);
    }
  }

  /**
   * Format date as DD-MM-YYYY with day name
   */
  static formatDateWithDay(date: Date = new Date()): { date: string; day: string } {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return {
      date: `${d}-${m}-${y}`,
      day: days[date.getDay()],
    };
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

  static addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Math.max(...users.map(u => u.id || 0), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.setUsers(users);
    return newUser;
  }

  static updateUser(id: number, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.setUsers(users);
      return true;
    }
    return false;
  }

  static deleteUser(id: number): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length < users.length) {
      this.setUsers(filtered);
      return true;
    }
    return false;
  }

  static getUserById(id: number): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username === username);
  }

  static searchUsers(query: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.getUsers().filter(
      u =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.phoneNumber?.toLowerCase().includes(lowerQuery) ||
        u.notes?.toLowerCase().includes(lowerQuery)
    );
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

  static addInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice {
    const invoices = this.getInvoices();
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.max(...invoices.map(i => i.id || 0), 0) + 1,
      createdAt: new Date().toISOString(),
      editHistory: [],
    };
    invoices.push(newInvoice);
    this.setInvoices(invoices);
    return newInvoice;
  }

  static updateInvoice(id: number, updates: Partial<Invoice>, changedBy: string = 'system'): boolean {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      const oldInvoice = invoices[index];
      const changes: Record<string, { old: any; new: any }> = {};

      Object.keys(updates).forEach(key => {
        if (key !== 'editHistory' && (updates as any)[key] !== oldInvoice[key as keyof Invoice]) {
          changes[key] = {
            old: oldInvoice[key as keyof Invoice],
            new: (updates as any)[key],
          };
        }
      });

      const editHistory: EditHistory = {
        timestamp: new Date().toISOString(),
        changedBy,
        changes,
      };

      invoices[index] = {
        ...oldInvoice,
        ...updates,
        updatedAt: new Date().toISOString(),
        editHistory: [...(oldInvoice.editHistory || []), editHistory],
      };

      this.setInvoices(invoices);
      return true;
    }
    return false;
  }

  static deleteInvoice(id: number): boolean {
    const invoices = this.getInvoices();
    const filtered = invoices.filter(i => i.id !== id);
    if (filtered.length < invoices.length) {
      this.setInvoices(filtered);
      return true;
    }
    return false;
  }

  static getInvoicesByDate(date: string): Invoice[] {
    return this.getInvoices().filter(i => i.invoiceDate === date);
  }

  static getInvoicesByUser(userId: number): Invoice[] {
    return this.getInvoices().filter(i => i.userId === userId);
  }

  static getInvoicesByDateRange(startDate: string, endDate: string): Invoice[] {
    return this.getInvoices().filter(i => i.invoiceDate >= startDate && i.invoiceDate <= endDate);
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

  static addPurchase(purchase: Omit<Purchase, 'id' | 'createdAt'>): Purchase {
    const purchases = this.getPurchases();
    const newPurchase: Purchase = {
      ...purchase,
      id: Math.max(...purchases.map(p => p.id || 0), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    purchases.push(newPurchase);
    this.setPurchases(purchases);
    return newPurchase;
  }

  static updatePurchase(id: number, updates: Partial<Purchase>): boolean {
    const purchases = this.getPurchases();
    const index = purchases.findIndex(p => p.id === id);
    if (index !== -1) {
      purchases[index] = {
        ...purchases[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.setPurchases(purchases);
      return true;
    }
    return false;
  }

  static deletePurchase(id: number): boolean {
    const purchases = this.getPurchases();
    const filtered = purchases.filter(p => p.id !== id);
    if (filtered.length < purchases.length) {
      this.setPurchases(filtered);
      return true;
    }
    return false;
  }

  static getPurchasesByDate(date: string): Purchase[] {
    return this.getPurchases().filter(p => p.purchaseDate === date);
  }

  static getPurchasesBySupplier(supplier: string): Purchase[] {
    return this.getPurchases().filter(p => p.supplier === supplier);
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

  static addPayment(payment: Omit<CustomerPayment, 'id' | 'createdAt'>): CustomerPayment {
    const payments = this.getPayments();
    const newPayment: CustomerPayment = {
      ...payment,
      id: Math.max(...payments.map(p => p.id || 0), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    this.setPayments(payments);
    return newPayment;
  }

  static getPaymentsByDate(date: string): CustomerPayment[] {
    return this.getPayments().filter(p => p.paymentDate === date);
  }

  static getPaymentsByUser(userId: number): CustomerPayment[] {
    return this.getPayments().filter(p => p.userId === userId);
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

  static addPaymentMethod(method: Omit<PaymentMethod, 'id'>): PaymentMethod {
    const methods = this.getPaymentMethods();
    const newMethod: PaymentMethod = {
      ...method,
      id: Math.max(...methods.map(m => m.id || 0), 0) + 1,
    };
    methods.push(newMethod);
    this.setPaymentMethods(methods);
    return newMethod;
  }

  static updatePaymentMethod(id: number, updates: Partial<PaymentMethod>): boolean {
    const methods = this.getPaymentMethods();
    const index = methods.findIndex(m => m.id === id);
    if (index !== -1) {
      methods[index] = { ...methods[index], ...updates };
      this.setPaymentMethods(methods);
      return true;
    }
    return false;
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

  static addReminder(reminder: Omit<DebtReminder, 'id' | 'createdAt'>): DebtReminder {
    const reminders = this.getReminders();
    const newReminder: DebtReminder = {
      ...reminder,
      id: Math.max(...reminders.map(r => r.id || 0), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    reminders.push(newReminder);
    this.setReminders(reminders);
    return newReminder;
  }

  static markReminderAsRead(id: number): boolean {
    const reminders = this.getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      reminder.isRead = true;
      this.setReminders(reminders);
      return true;
    }
    return false;
  }

  static getPendingReminders(): DebtReminder[] {
    return this.getReminders().filter(r => !r.isRead);
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
        creditLimit: 100,
        balance: 0,
        phoneNumber: '0599123456',
        createdAt: today,
      },
      {
        id: 6,
        username: 'customer2',
        email: 'customer2@store.com',
        name: 'فاطمة محمد',
        role: 'customer',
        isPermanentCustomer: true,
        creditLimit: 150,
        balance: 0,
        phoneNumber: '0599234567',
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
        balance: 0,
        phoneNumber: '0599345678',
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
    const { date, day } = this.formatDateWithDay();
    return [
      {
        id: 1,
        userId: 5,
        invoiceDate: date,
        dayName: day,
        amount: 50,
        paymentStatus: 'paid',
        paymentMethodId: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        userId: 6,
        invoiceDate: date,
        dayName: day,
        amount: 75,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        userId: 7,
        invoiceDate: date,
        dayName: day,
        amount: 100,
        paymentStatus: 'partial',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  private static generateDummyPurchases(): Purchase[] {
    const { date } = this.formatDateWithDay();
    return [
      {
        id: 1,
        supplier: 'المورد الأول',
        amount: 200,
        paymentMethodId: 1,
        purchaseDate: date,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        supplier: 'المورد الثاني',
        amount: 150,
        paymentMethodId: 1,
        purchaseDate: date,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  private static generateDummyPayments(): CustomerPayment[] {
    const { date } = this.formatDateWithDay();
    return [
      {
        id: 1,
        userId: 5,
        invoiceId: 1,
        amount: 50,
        paymentMethodId: 1,
        paymentDate: date,
        createdAt: new Date().toISOString(),
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

  static getStorageSize(): number {
    let size = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        size += data.length;
      }
    });
    return size;
  }
}

export default StorageService;
