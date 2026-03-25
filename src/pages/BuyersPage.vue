<template>
  <div class="space-y-4">
    <div class="card">
      <h2 class="text-2xl font-bold mb-4">العملاء الدائمين</h2>
      <input
        v-model="searchQuery"
        type="text"
        class="input mb-4"
        placeholder="ابحث عن عميل..."
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="card-hover"
      >
        <h3 class="text-lg font-bold mb-2">{{ customer.name }}</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>الدين:</span>
            <span :class="['font-bold', customerDebt(customer.id || 0) > 0 ? 'text-danger' : 'text-success']">
              {{ customerDebt(customer.id || 0) }} ش.ج
            </span>
          </div>
          <div class="flex justify-between">
            <span>الحد الأقصى:</span>
            <span class="font-bold">{{ customer.creditLimit }} ش.ج</span>
          </div>
          <div class="mt-3">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                :style="{ width: debtPercentage(customer.id || 0) + '%' }"
                :class="[
                  'h-2 rounded-full',
                  debtPercentage(customer.id || 0) >= 90 ? 'bg-danger' : 'bg-success'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '../types/index';
import StorageService from '../services/storage';
import BusinessService from '../services/business';

const searchQuery = ref('');
const customers = ref<User[]>([]);

const filteredCustomers = computed(() => {
  return customers.value.filter(c =>
    c.name.includes(searchQuery.value) && c.role === 'customer'
  );
});

const customerDebt = (userId: number) => {
  return BusinessService.calculateCustomerDebt(userId);
};

const debtPercentage = (userId: number) => {
  const customer = customers.value.find(c => c.id === userId);
  if (!customer || !customer.creditLimit) return 0;
  return Math.min((customerDebt(userId) / customer.creditLimit) * 100, 100);
};

onMounted(() => {
  customers.value = StorageService.getUsers();
});
</script>
