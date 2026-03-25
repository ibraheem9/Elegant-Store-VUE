<template>
  <div class="space-y-4">
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">مشتريات اليوم</h2>
      
      <form @submit.prevent="addPurchase" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="form-group">
          <label class="form-label">اسم المورد</label>
          <input v-model="form.supplier" type="text" class="input" placeholder="اسم المورد" required />
        </div>

        <div class="form-group">
          <label class="form-label">المبلغ</label>
          <input v-model.number="form.amount" type="number" class="input" placeholder="0.00" required />
        </div>

        <div class="form-group">
          <label class="form-label">طريقة الدفع</label>
          <select v-model="form.paymentMethod" class="input">
            <option value="">اختر طريقة دفع</option>
            <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
              {{ method.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button type="submit" class="btn btn-primary w-full">إضافة مشتري</button>
        </div>
      </form>
    </div>

    <div class="card">
      <h3 class="text-xl font-bold mb-4">المشتريات</h3>
      <div v-if="todayPurchases.length" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>المورد</th>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in todayPurchases" :key="purchase.id">
              <td>{{ purchase.supplier }}</td>
              <td>{{ purchase.amount }} ش.ج</td>
              <td>{{ getPaymentMethodName(purchase.paymentMethodId) }}</td>
              <td>
                <button @click="deletePurchase(purchase.id)" class="btn btn-danger btn-sm">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        لا توجد مشتريات اليوم
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card bg-blue-50 dark:bg-blue-900/20">
        <p class="text-gray-600 dark:text-gray-400">إجمالي المشتريات</p>
        <p class="text-3xl font-bold text-blue-600">{{ totalPurchases }} ش.ج</p>
      </div>
      <div class="card bg-green-50 dark:bg-green-900/20">
        <p class="text-gray-600 dark:text-gray-400">المشتريات النقدية</p>
        <p class="text-3xl font-bold text-green-600">{{ cashPurchases }} ش.ج</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Purchase } from '../types/index';
import StorageService from '../services/storage';

const form = ref({ supplier: '', amount: 0, paymentMethod: '' });
const todayPurchases = ref<Purchase[]>([]);
const paymentMethods = ref<any[]>([]);

const totalPurchases = computed(() =>
  todayPurchases.value.reduce((sum, p) => sum + p.amount, 0)
);

const cashPurchases = computed(() =>
  todayPurchases.value
    .filter(p => p.paymentMethodId === 1)
    .reduce((sum, p) => sum + p.amount, 0)
);

const addPurchase = () => {
  if (!form.value.supplier || !form.value.amount) {
    alert('يرجى ملء جميع الحقول');
    return;
  }

  const purchase: Purchase = {
    supplier: form.value.supplier,
    amount: form.value.amount,
    paymentMethodId: form.value.paymentMethod ? parseInt(form.value.paymentMethod) : undefined,
    purchaseDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  StorageService.addPurchase(purchase);
  loadTodayPurchases();
  form.value = { supplier: '', amount: 0, paymentMethod: '' };
};

const deletePurchase = (id: number | undefined) => {
  if (id && confirm('هل تريد حذف هذه المشتري؟')) {
    StorageService.deletePurchase(id);
    loadTodayPurchases();
  }
};

const getPaymentMethodName = (methodId: number | undefined) => {
  return paymentMethods.value.find(m => m.id === methodId)?.name || 'غير محدد';
};

const loadTodayPurchases = () => {
  const today = new Date().toISOString().split('T')[0];
  todayPurchases.value = StorageService.getPurchasesByDate(today);
};

onMounted(() => {
  paymentMethods.value = StorageService.getPaymentMethods();
  loadTodayPurchases();
});
</script>
