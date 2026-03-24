import React, { createContext, useContext, useState, useCallback } from "react";
import {
  StorageService,
  type Sale,
  type Purchase,
  type Buyer,
  type Payment,
} from "./storage";

interface DataContextType {
  // Sales
  sales: Sale[];
  addSale: (sale: Sale) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  getSalesToday: () => Sale[];
  getTotalSalesToday: () => number;

  // Purchases
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => Promise<void>;
  updatePurchase: (id: string, updates: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
  getTotalPurchasesToday: () => number;

  // Buyers
  buyers: Buyer[];
  addBuyer: (buyer: Buyer) => Promise<void>;
  updateBuyer: (id: string, updates: Partial<Buyer>) => Promise<void>;
  deleteBuyer: (id: string) => Promise<void>;
  getBuyerDebtStatus: (buyerId: string) => { debt: number; limit: number; percentage: number };

  // Payments
  payments: Payment[];
  addPayment: (payment: Payment) => Promise<void>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getPaymentsToday: () => Payment[];

  // Statistics
  getCashTotal: () => number;
  getPreviousDayTotal: () => number;
  getDailyIncome: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Initialize data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [salesData, purchasesData, buyersData, paymentsData] =
          await Promise.all([
            StorageService.getSales(),
            StorageService.getPurchases(),
            StorageService.getBuyers(),
            StorageService.getPayments(),
          ]);
        setSales(salesData);
        setPurchases(purchasesData);
        setBuyers(buyersData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Sales operations
  const addSale = useCallback(async (sale: Sale) => {
    await StorageService.addSale(sale);
    setSales((prev) => [...prev, sale]);
  }, []);

  const updateSale = useCallback(async (id: string, updates: Partial<Sale>) => {
    await StorageService.updateSale(id, updates);
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSale = useCallback(async (id: string) => {
    await StorageService.deleteSale(id);
    setSales((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSalesToday = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return sales.filter((s) => s.date === today);
  }, [sales]);

  const getTotalSalesToday = useCallback(() => {
    return getSalesToday().reduce((sum, s) => sum + s.amount, 0);
  }, [getSalesToday]);

  // Purchases operations
  const addPurchase = useCallback(async (purchase: Purchase) => {
    await StorageService.addPurchase(purchase);
    setPurchases((prev) => [...prev, purchase]);
  }, []);

  const updatePurchase = useCallback(
    async (id: string, updates: Partial<Purchase>) => {
      await StorageService.updatePurchase(id, updates);
      setPurchases((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const deletePurchase = useCallback(async (id: string) => {
    await StorageService.deletePurchase(id);
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getTotalPurchasesToday = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return purchases
      .filter((p) => p.date === today)
      .reduce((sum, p) => sum + p.amount, 0);
  }, [purchases]);

  // Buyers operations
  const addBuyer = useCallback(async (buyer: Buyer) => {
    await StorageService.addBuyer(buyer);
    setBuyers((prev) => [...prev, buyer]);
  }, []);

  const updateBuyer = useCallback(async (id: string, updates: Partial<Buyer>) => {
    await StorageService.updateBuyer(id, updates);
    setBuyers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBuyer = useCallback(async (id: string) => {
    await StorageService.deleteBuyer(id);
    setBuyers((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getBuyerDebtStatus = useCallback(
    (buyerId: string) => {
      const buyer = buyers.find((b) => b.id === buyerId);
      if (!buyer) return { debt: 0, limit: 0, percentage: 0 };
      return {
        debt: buyer.totalDebt,
        limit: buyer.debtLimit,
        percentage: (buyer.totalDebt / buyer.debtLimit) * 100,
      };
    },
    [buyers]
  );

  // Payments operations
  const addPayment = useCallback(async (payment: Payment) => {
    await StorageService.addPayment(payment);
    setPayments((prev) => [...prev, payment]);
  }, []);

  const updatePayment = useCallback(
    async (id: string, updates: Partial<Payment>) => {
      await StorageService.updatePayment(id, updates);
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const deletePayment = useCallback(async (id: string) => {
    await StorageService.deletePayment(id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getPaymentsToday = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return payments.filter((p) => p.date === today);
  }, [payments]);

  // Statistics
  const getCashTotal = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const cashSales = sales
      .filter((s) => s.date === today && s.paymentMethod === "cash")
      .reduce((sum, s) => sum + s.amount, 0);
    const cashPayments = payments
      .filter((p) => p.date === today && p.method === "cash")
      .reduce((sum, p) => sum + p.amount, 0);
    return cashSales + cashPayments;
  }, [sales, payments]);

  const getPreviousDayTotal = useCallback(() => {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const cashSales = sales
      .filter((s) => s.date === yesterday && s.paymentMethod === "cash")
      .reduce((sum, s) => sum + s.amount, 0);
    const cashPayments = payments
      .filter((p) => p.date === yesterday && p.method === "cash")
      .reduce((sum, p) => sum + p.amount, 0);
    return cashSales + cashPayments;
  }, [sales, payments]);

  const getDailyIncome = useCallback(() => {
    return getTotalSalesToday();
  }, [getTotalSalesToday]);

  return (
    <DataContext.Provider
      value={{
        sales,
        addSale,
        updateSale,
        deleteSale,
        getSalesToday,
        getTotalSalesToday,
        purchases,
        addPurchase,
        updatePurchase,
        deletePurchase,
        getTotalPurchasesToday,
        buyers,
        addBuyer,
        updateBuyer,
        deleteBuyer,
        getBuyerDebtStatus,
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentsToday,
        getCashTotal,
        getPreviousDayTotal,
        getDailyIncome,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
