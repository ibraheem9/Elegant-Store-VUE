<template>
  <div class="space-y-4">
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">المبيعات اليومية</h2>
      
      <form @submit.prevent="addSale" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="form-group">
          <label class="form-label">اسم المشتري</label>
          <input v-model="form.customerName" type="text" class="input" placeholder="ابدأ بالكتابة..." />
          <div v-if="filteredCustomers.length" class="mt-2 border border-gray-300 rounded">
            <div
              v-for="customer in filteredCustomers"
              :key="customer.id"
              @click="selectCustomer(customer)"
              class="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ customer.name }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">المبلغ</label>
          <input v-model.number="form.amount" type="number" class="input" placeholder="0.00" required />
        </div>

        <div class="form-group">
          <label class="form-label">طريقة الدفع</label>
          <select v-model="form.paymentMethod" class="input" required>
            <option value="">اختر طريقة دفع</option>
            <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
              {{ method.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button type="submit" class="btn btn-primary w-full">إضافة مبيعة</button>
        </div>
      </form>
    </div>

    <!-- Sales List -->
    <div class="card">
      <h3 class="text-xl font-bold mb-4">المبيعات</h3>
      <div v-if="todaySales.length" class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>المشتري</th>
              <th>المبلغ</th>
              <th>طريقة الدفع</th>
              <th>الوقت</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in todaySales" :key="sale.id">
              <td>{{ getCustomerName(sale.userId) }}</td>
              <td>{{ sale.amount }} ش.ج</td>
              <td>{{ getPaymentMethodName(sale.paymentMethodId) }}</td>
              <td>{{ new Date(sale.createdAt).toLocaleTimeString('ar-EG') }}</td>
              <td>
                <button @click="deleteSale(sale.id)" class="btn btn-danger btn-sm">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        لا توجد مبيعات اليوم
      </div>
    </div>

    <!-- Daily Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-blue-50 dark:bg-blue-900/20">
        <p class="text-gray-600 dark:text-gray-400">إجمالي المبيعات</p>
        <p class="text-3xl font-bold text-blue-600">{{ totalSales }} ش.ج</p>
      </div>
      <div class="card bg-green-50 dark:bg-green-900/20">
        <p class="text-gray-600 dark:text-gray-400">المبيعات النقدية</p>
        <p class="text-3xl font-bold text-green-600">{{ cashSales }} ش.ج</p>
      </div>
      <div class="card bg-purple-50 dark:bg-purple-900/20">
        <p class="text-gray-600 dark:text-gray-400">المبيعات بالتطبيق</p>
        <p class="text-3xl font-bold text-purple-600">{{ appSales }} ش.ج</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Invoice, User } from '../types/index';
import StorageService from '../services/storage';
import BusinessService from '../services/business';

const form = ref({ customerName: '', amount: 0, paymentMethod: '' });
const todaySales = ref<Invoice[]>([]);
const customers = ref<User[]>([]);
const paymentMethods = ref<any[]>([]);
const selectedCustomer = ref<User | null>(null);

const filteredCustomers = computed(() => {
  if (!form.value.customerName) return [];
  return customers.value.filter(c =>
    c.name.includes(form.value.customerName) && c.role === 'customer'
  );
});

const totalSales = computed(() =>
  todaySales.value.reduce((sum, s) => sum + s.amount, 0)
);

const cashSales = computed(() =>
  todaySales.value
    .filter(s => s.paymentMethodId === 1)
    .reduce((sum, s) => sum + s.amount, 0)
);

const appSales = computed(() =>
  todaySales.value
    .filter(s => s.paymentMethodId && s.paymentMethodId > 1)
    .reduce((sum, s) => sum + s.amount, 0)
);

const selectCustomer = (customer: User) => {
  selectedCustomer.value = customer;
  form.value.customerName = customer.name;
};

const addSale = () => {
  if (!selectedCustomer.value || !form.value.amount || !form.value.paymentMethod) {
    alert('يرجى ملء جميع الحقول');
    return;
  }

  const invoice: Invoice = {
    userId: selectedCustomer.value.id || 0,
    invoiceDate: new Date().toISOString().split('T')[0],
    amount: form.value.amount,
    paymentStatus: form.value.paymentMethod === '1' ? 'paid' : 'pending',
    paymentMethodId: parseInt(form.value.paymentMethod),
    createdAt: new Date().toISOString(),
  };

  StorageService.addInvoice(invoice);
  loadTodaySales();
  form.value = { customerName: '', amount: 0, paymentMethod: '' };
  selectedCustomer.value = null;
};

const deleteSale = (id: number | undefined) => {
  if (id && confirm('هل تريد حذف هذه المبيعة؟')) {
    StorageService.deleteInvoice(id);
    loadTodaySales();
  }
};

const getCustomerName = (userId: number) => {
  return customers.value.find(c => c.id === userId)?.name || 'غير معروف';
};

const getPaymentMethodName = (methodId: number | undefined) => {
  return paymentMethods.value.find(m => m.id === methodId)?.name || 'غير معروف';
};

const loadTodaySales = () => {
  const today = new Date().toISOString().split('T')[0];
  todaySales.value = StorageService.getInvoicesByDate(today);
};

onMounted(() => {
  customers.value = StorageService.getUsers();
  paymentMethods.value = StorageService.getPaymentMethods();
  loadTodaySales();
});
</script>
