<template>
  <div class="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">متجر</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="form-group">
          <label class="form-label">اسم المستخدم</label>
          <input
            v-model="username"
            type="text"
            class="input"
            placeholder="أدخل اسم المستخدم"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">كلمة المرور</label>
          <input
            v-model="password"
            type="password"
            class="input"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <button type="submit" class="btn btn-primary w-full justify-center">
          <span v-if="!loading">تسجيل الدخول</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <div class="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p class="text-sm font-semibold mb-2">بيانات الاختبار:</p>
        <p class="text-xs">hamoda / hamoda123</p>
        <p class="text-xs">ibrahim / ibrahim123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '../types/index';
import AuthService from '../services/auth';

const emit = defineEmits<{
  login: [user: User];
}>();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = () => {
  error.value = '';
  loading.value = true;

  setTimeout(() => {
    const result = AuthService.login(username.value, password.value);
    loading.value = false;

    if (result.success && result.user) {
      emit('login', result.user);
    } else {
      error.value = result.error || 'خطأ في تسجيل الدخول';
    }
  }, 500);
};
</script>
