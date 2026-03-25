<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Login Page -->
    <LoginPage v-if="!isAuthenticated" @login="handleLogin" />

    <!-- Main Application -->
    <template v-else>
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-primary">متجر</h1>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentUser?.name }}</span>
          </div>
          <button @click="handleLogout" class="btn btn-secondary">
            تسجيل الخروج
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 py-6">
        <!-- Navigation Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'btn px-4 py-2 whitespace-nowrap',
              activeTab === tab.id ? 'btn-primary' : 'btn-secondary'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="space-y-4">
          <SalesPage v-if="activeTab === 'sales'" />
          <StatisticsPage v-if="activeTab === 'statistics'" />
          <PurchasesPage v-if="activeTab === 'purchases'" />
          <BuyersPage v-if="activeTab === 'buyers'" />
          <PaymentsPage v-if="activeTab === 'payments'" />
        </div>
      </main>

      <!-- Notifications -->
      <div class="fixed bottom-4 right-4 space-y-2 max-w-sm">
        <div v-for="notification in notifications" :key="notification.id" :class="['alert', `alert-${notification.type}`]">
          {{ notification.message }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User, Notification } from './types/index';
import AuthService from './services/auth';
import StorageService from './services/storage';
import LoginPage from './pages/LoginPage.vue';
import SalesPage from './pages/SalesPage.vue';
import StatisticsPage from './pages/StatisticsPage.vue';
import PurchasesPage from './pages/PurchasesPage.vue';
import BuyersPage from './pages/BuyersPage.vue';
import PaymentsPage from './pages/PaymentsPage.vue';

const isAuthenticated = ref(false);
const currentUser = ref<User | null>(null);
const activeTab = ref('sales');
const notifications = ref<Notification[]>([]);

const tabs = [
  { id: 'sales', label: 'المبيعات' },
  { id: 'statistics', label: 'الإحصائيات' },
  { id: 'purchases', label: 'المشتريات' },
  { id: 'buyers', label: 'العملاء' },
  { id: 'payments', label: 'الدفعات' },
];

const handleLogin = (user: User) => {
  currentUser.value = user;
  isAuthenticated.value = true;
};

const handleLogout = () => {
  AuthService.logout();
  isAuthenticated.value = false;
  currentUser.value = null;
  activeTab.value = 'sales';
};

onMounted(() => {
  StorageService.initializeDummyData();
  const user = AuthService.getCurrentUser();
  if (user) {
    currentUser.value = user;
    isAuthenticated.value = true;
  }
});
</script>

<style scoped>
#app {
  direction: rtl;
  text-align: right;
}
</style>
