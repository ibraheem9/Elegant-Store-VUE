/**
 * Authentication Service
 * Handles user login, logout, and session management
 */

import type { User } from '../types/index';
import StorageService from './storage';

class AuthService {
  /**
   * Authenticate user with username and password
   */
  static login(username: string, password: string): { success: boolean; user?: User; error?: string } {
    try {
      // Simple password validation (in production, use proper hashing)
      const validCredentials: Record<string, string> = {
        hamoda: 'hamoda123',
        abdelhadi: 'abdelhadi123',
        ahmad: 'ahmad123',
        ibrahim: 'ibrahim123',
      };

      if (validCredentials[username] !== password) {
        return { success: false, error: 'بيانات الدخول غير صحيحة' };
      }

      const user = StorageService.getUserByUsername(username);
      if (!user) {
        return { success: false, error: 'المستخدم غير موجود' };
      }

      StorageService.setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'خطأ في المصادقة' };
    }
  }

  /**
   * Logout current user
   */
  static logout(): void {
    StorageService.setCurrentUser(null);
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    return StorageService.getCurrentUser();
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return StorageService.getCurrentUser() !== null;
  }

  /**
   * Check if current user is manager
   */
  static isManager(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'manager';
  }

  /**
   * Check if current user is accountant
   */
  static isAccountant(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'accountant';
  }
}

export default AuthService;
