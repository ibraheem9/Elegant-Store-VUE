<template>
  <div class="space-y-4">
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">تسجيل الدفعات</h2>
      
      <form @submit.prevent="addPayment" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="form-group">
          <label class="form-label">العميل</label>
          <select v-model="form.customerId" class="input" required>
            <option value="">اختر عميل</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">المبلغ</label>
          <input v-model.number="form.amount" type="number" class="input" placeholder="0.00" required />
        </div>

        <div class="form-group">
          <label class="form-label">طريقة الدفع</label>
          <select v-model="form.paymentMethod" class="input" required>
            <option value="">اختر طريقة</option>
            <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
              {{ method.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button type="submit" class="btn btn-primary w-full">تسجيل دفعة</button>
        </div>
      </form>
    </div>

    <div class="card">
      <h3 class="text-xl font-bold mb-4">الدفعات اليومية</h3>
      <div v-if="todayPayments.length" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>العميل</th>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>الوقت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in todayPayments" :key="payment.id">
              <td>{{ getCustomerName(payment.userId) }}</td>
              <td>{{ payment.amount }} ش.ج</td>
              <td>{{ getPaymentMethodName(payment.paymentMethodId) }}</td>
              <td>{{ new Date(payment.createdAt).toLocaleTimeString('ar-EG') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        لا توجد دفعات اليوم
      </div>
    </div>

    <div class="card bg-green-50 dark:bg-green-900/20">
      <p class="text-gray-600 dark:text-gray-400">إجمالي الدفعات اليومية</p>
      <p class="text-3xl font-bold text-green-600">{{ totalPayments }} ش.ج</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CustomerPayment, User } from '../types/index';
import StorageService from '../services/storage';

const form = ref({ customerId: '', amount: 0, paymentMethod: '' });
const todayPayments = ref<CustomerPayment[]>([]);
const customers = ref<User[]>([]);
const paymentMethods = ref<any[]>([]);

const totalPayments = computed(() =>
  todayPayments.value.reduce((sum, p) => sum + p.amount, 0)
);

const addPayment = () => {
  if (!form.value.customerId || !form.value.amount || !form.value.paymentMethod) {
    alert('يرجى ملء جميع الحقول');
    return;
  }

  const payment: CustomerPayment = {
    userId: parseInt(form.value.customerId),
    amount: form.value.amount,
    paymentMethodId: parseInt(form.value.paymentMethod),
    paymentDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  StorageService.addPayment(payment);
  loadTodayPayments();
  form.value = { customerId: '', amount: 0, paymentMethod: '' };
};

const getCustomerName = (userId: number) => {
  return customers.value.find(c => c.id === userId)?.name || 'غير معروف';
};

const getPaymentMethodName = (methodId: number | undefined) => {
  return paymentMethods.value.find(m => m.id === methodId)?.name || 'غير معروف';
};

const loadTodayPayments = () => {
  const today = new Date().toISOString().split('T')[0];
  todayPayments.value = StorageService.getPaymentsByDate(today);
};

onMounted(() => {
  customers.value = StorageService.getUsers().filter(u => u.role === 'customer');
  paymentMethods.value = StorageService.getPaymentMethods();
  loadTodayPayments();
});
</script>
