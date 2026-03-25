<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <p class="text-gray-600 dark:text-gray-400 text-sm">الصندوق أمس</p>
        <p class="text-2xl font-bold text-blue-600">{{ yesterdayBox }} ش.ج</p>
      </div>
      <div class="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <p class="text-gray-600 dark:text-gray-400 text-sm">الصندوق اليوم</p>
        <p class="text-2xl font-bold text-green-600">{{ todayBox }} ش.ج</p>
      </div>
      <div class="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <p class="text-gray-600 dark:text-gray-400 text-sm">دخل اليوم</p>
        <p class="text-2xl font-bold text-purple-600">{{ dailyIncome }} ش.ج</p>
      </div>
      <div class="card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
        <p class="text-gray-600 dark:text-gray-400 text-sm">إجمالي المبيعات</p>
        <p class="text-2xl font-bold text-orange-600">{{ totalSales }} ش.ج</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">المبيعات حسب الطريقة</h3>
        <div class="space-y-2">
          <div v-for="(amount, method) in salesByMethod" :key="method" class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span>{{ method }}</span>
            <span class="font-bold">{{ amount }} ش.ج</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-xl font-bold mb-4">ملخص اليوم</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span>سداد الديون نقدي:</span><span class="font-bold">{{ cashPayments }} ش.ج</span></div>
          <div class="flex justify-between"><span>سداد الديون تطبيق:</span><span class="font-bold">{{ appPayments }} ش.ج</span></div>
          <div class="flex justify-between"><span>مشتريات نقدي:</span><span class="font-bold">{{ cashPurchases }} ش.ج</span></div>
          <div class="flex justify-between"><span>مشتريات تطبيق:</span><span class="font-bold">{{ appPurchases }} ش.ج</span></div>
          <div class="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between font-bold">
            <span>إجمالي المشتريات:</span>
            <span>{{ totalPurchases }} ش.ج</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import StorageService from '../services/storage';
import BusinessService from '../services/business';

const yesterdayBox = ref(0);
const todayBox = ref(0);
const dailyIncome = ref(0);
const salesByMethod = ref<Record<string, number>>({});
const cashPayments = ref(0);
const appPayments = ref(0);
const cashPurchases = ref(0);
const appPurchases = ref(0);

const totalSales = computed(() => BusinessService.calculateDailySales(getTodayDate()));
const totalPurchases = computed(() => BusinessService.calculateDailyPurchases(getTodayDate()));

const getTodayDate = () => new Date().toISOString().split('T')[0];

onMounted(() => {
  const today = getTodayDate();
  
  todayBox.value = 1000;
  yesterdayBox.value = 800;
  
  salesByMethod.value = BusinessService.getSalesByPaymentMethod(today);
  
  cashPayments.value = StorageService.getPaymentsByDate(today)
    .filter(p => p.paymentMethodId === 1)
    .reduce((sum, p) => sum + p.amount, 0);
  
  appPayments.value = StorageService.getPaymentsByDate(today)
    .filter(p => p.paymentMethodId && p.paymentMethodId > 1)
    .reduce((sum, p) => sum + p.amount, 0);
  
  cashPurchases.value = StorageService.getPurchasesByDate(today)
    .filter(p => p.paymentMethodId === 1)
    .reduce((sum, p) => sum + p.amount, 0);
  
  appPurchases.value = StorageService.getPurchasesByDate(today)
    .filter(p => p.paymentMethodId && p.paymentMethodId > 1)
    .reduce((sum, p) => sum + p.amount, 0);
  
  dailyIncome.value = todayBox.value + (totalSales.value - (totalSales.value - cashPurchases.value)) + cashPurchases.value - yesterdayBox.value - cashPayments.value;
});
</script>
