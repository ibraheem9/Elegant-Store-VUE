import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export interface User {
  id: string;
  username: string;
  password: string;
  role: "accountant" | "manager";
  name: string;
}

export interface Sale {
  id: string;
  date: string;
  customerName: string;
  amount: number;
  paymentMethod: "cash" | "app";
  timestamp: number;
}

export interface Purchase {
  id: string;
  date: string;
  vendorName: string;
  amount: number;
  notes: string;
  timestamp: number;
}

export interface Buyer {
  id: string;
  name: string;
  debtLimit: number;
  totalDebt: number;
  createdAt: number;
  lastUpdated: number;
}

export interface Payment {
  id: string;
  date: string;
  customerName: string;
  amount: number;
  method: "cash" | "app";
  invoiceReference?: string;
  timestamp: number;
}

export interface AppData {
  users: User[];
  sales: Sale[];
  purchases: Purchase[];
  buyers: Buyer[];
  payments: Payment[];
  currentUser: User | null;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "store_app_users",
  SALES: "store_app_sales",
  PURCHASES: "store_app_purchases",
  BUYERS: "store_app_buyers",
  PAYMENTS: "store_app_payments",
  CURRENT_USER: "store_app_current_user",
};

// Dummy data
const DUMMY_USERS: User[] = [
  {
    id: "user_1",
    username: "hamoda",
    password: "hamoda123",
    role: "accountant",
    name: "محمد ياغي (حمودة)",
  },
  {
    id: "user_2",
    username: "abdelhadi",
    password: "abdelhadi123",
    role: "accountant",
    name: "محمد عبد الهادي (جدل)",
  },
  {
    id: "user_3",
    username: "ahmad",
    password: "ahmad123",
    role: "accountant",
    name: "أحمد ياغي",
  },
  {
    id: "user_4",
    username: "ibrahim",
    password: "ibrahim123",
    role: "manager",
    name: "إبراهيم عبد الهادي",
  },
];

const DUMMY_SALES: Sale[] = [
  {
    id: "sale_1",
    date: "2026-03-24",
    customerName: "أحمد",
    amount: 150,
    paymentMethod: "cash",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "sale_2",
    date: "2026-03-24",
    customerName: "محمد",
    amount: 200,
    paymentMethod: "app",
    timestamp: Date.now() - 7200000,
  },
  {
    id: "sale_3",
    date: "2026-03-24",
    customerName: "علي",
    amount: 100,
    paymentMethod: "cash",
    timestamp: Date.now() - 10800000,
  },
  {
    id: "sale_4",
    date: "2026-03-23",
    customerName: "فاطمة",
    amount: 250,
    paymentMethod: "cash",
    timestamp: Date.now() - 86400000,
  },
];

const DUMMY_PURCHASES: Purchase[] = [
  {
    id: "purchase_1",
    date: "2026-03-24",
    vendorName: "مصنع الجودة",
    amount: 500,
    notes: "بضاعة عامة",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "purchase_2",
    date: "2026-03-23",
    vendorName: "شركة النور",
    amount: 800,
    notes: "منتجات غذائية",
    timestamp: Date.now() - 86400000,
  },
];

const DUMMY_BUYERS: Buyer[] = [
  {
    id: "buyer_1",
    name: "أحمد",
    debtLimit: 1000,
    totalDebt: 950,
    createdAt: Date.now() - 2592000000,
    lastUpdated: Date.now(),
  },
  {
    id: "buyer_2",
    name: "محمد",
    debtLimit: 500,
    totalDebt: 200,
    createdAt: Date.now() - 2592000000,
    lastUpdated: Date.now(),
  },
  {
    id: "buyer_3",
    name: "علي",
    debtLimit: 800,
    totalDebt: 0,
    createdAt: Date.now() - 2592000000,
    lastUpdated: Date.now(),
  },
  {
    id: "buyer_4",
    name: "فاطمة",
    debtLimit: 600,
    totalDebt: 450,
    createdAt: Date.now() - 2592000000,
    lastUpdated: Date.now(),
  },
];

const DUMMY_PAYMENTS: Payment[] = [
  {
    id: "payment_1",
    date: "2026-03-24",
    customerName: "محمد",
    amount: 200,
    method: "cash",
    invoiceReference: "INV-001",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "payment_2",
    date: "2026-03-24",
    customerName: "أحمد",
    amount: 500,
    method: "app",
    invoiceReference: "INV-002",
    timestamp: Date.now() - 7200000,
  },
  {
    id: "payment_3",
    date: "2026-03-23",
    customerName: "علي",
    amount: 300,
    method: "cash",
    invoiceReference: "INV-003",
    timestamp: Date.now() - 86400000,
  },
];

// Storage utility functions
export const StorageService = {
  // Initialize storage with dummy data
  async initialize() {
    try {
      const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      if (!existingUsers) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USERS,
          JSON.stringify(DUMMY_USERS)
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.SALES,
          JSON.stringify(DUMMY_SALES)
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.PURCHASES,
          JSON.stringify(DUMMY_PURCHASES)
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.BUYERS,
          JSON.stringify(DUMMY_BUYERS)
        );
        await AsyncStorage.setItem(
          STORAGE_KEYS.PAYMENTS,
          JSON.stringify(DUMMY_PAYMENTS)
        );
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  },

  // User operations
  async getUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  async setCurrentUser(user: User | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  },

  // Sales operations
  async getSales(): Promise<Sale[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting sales:", error);
      return [];
    }
  },

  async addSale(sale: Sale): Promise<void> {
    try {
      const sales = await this.getSales();
      sales.push(sale);
      await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  },

  async updateSale(id: string, updates: Partial<Sale>): Promise<void> {
    try {
      const sales = await this.getSales();
      const index = sales.findIndex((s) => s.id === id);
      if (index !== -1) {
        sales[index] = { ...sales[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
      }
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  },

  async deleteSale(id: string): Promise<void> {
    try {
      const sales = await this.getSales();
      const filtered = sales.filter((s) => s.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  },

  // Purchases operations
  async getPurchases(): Promise<Purchase[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PURCHASES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting purchases:", error);
      return [];
    }
  },

  async addPurchase(purchase: Purchase): Promise<void> {
    try {
      const purchases = await this.getPurchases();
      purchases.push(purchase);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PURCHASES,
        JSON.stringify(purchases)
      );
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  },

  async updatePurchase(id: string, updates: Partial<Purchase>): Promise<void> {
    try {
      const purchases = await this.getPurchases();
      const index = purchases.findIndex((p) => p.id === id);
      if (index !== -1) {
        purchases[index] = { ...purchases[index], ...updates };
        await AsyncStorage.setItem(
          STORAGE_KEYS.PURCHASES,
          JSON.stringify(purchases)
        );
      }
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  },

  async deletePurchase(id: string): Promise<void> {
    try {
      const purchases = await this.getPurchases();
      const filtered = purchases.filter((p) => p.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PURCHASES,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  },

  // Buyers operations
  async getBuyers(): Promise<Buyer[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BUYERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting buyers:", error);
      return [];
    }
  },

  async addBuyer(buyer: Buyer): Promise<void> {
    try {
      const buyers = await this.getBuyers();
      buyers.push(buyer);
      await AsyncStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(buyers));
    } catch (error) {
      console.error("Error adding buyer:", error);
    }
  },

  async updateBuyer(id: string, updates: Partial<Buyer>): Promise<void> {
    try {
      const buyers = await this.getBuyers();
      const index = buyers.findIndex((b) => b.id === id);
      if (index !== -1) {
        buyers[index] = {
          ...buyers[index],
          ...updates,
          lastUpdated: Date.now(),
        };
        await AsyncStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(buyers));
      }
    } catch (error) {
      console.error("Error updating buyer:", error);
    }
  },

  async deleteBuyer(id: string): Promise<void> {
    try {
      const buyers = await this.getBuyers();
      const filtered = buyers.filter((b) => b.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting buyer:", error);
    }
  },

  // Payments operations
  async getPayments(): Promise<Payment[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting payments:", error);
      return [];
    }
  },

  async addPayment(payment: Payment): Promise<void> {
    try {
      const payments = await this.getPayments();
      payments.push(payment);
      await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  },

  async updatePayment(id: string, updates: Partial<Payment>): Promise<void> {
    try {
      const payments = await this.getPayments();
      const index = payments.findIndex((p) => p.id === id);
      if (index !== -1) {
        payments[index] = { ...payments[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  },

  async deletePayment(id: string): Promise<void> {
    try {
      const payments = await this.getPayments();
      const filtered = payments.filter((p) => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};
