# Store Management Application - Design Document

## 🎯 Project Overview

A professional Vue 3 + Vite + Tailwind CSS web application for managing daily store operations including sales, purchases, customer debt tracking, and financial statistics.

**Technology Stack:**
- Vue 3 (Composition API)
- Vite (Build tool)
- Tailwind CSS (Styling)
- TypeScript (Type safety)
- LocalStorage (Data persistence)

---

## 📱 UI/UX Design

### Color Palette
- **Primary**: `#0a7ea4` (Teal) - Main actions and highlights
- **Secondary**: `#1e90ff` (Dodger Blue) - Secondary actions
- **Success**: `#22C55E` (Green) - Positive states
- **Danger**: `#EF4444` (Red) - Warnings and deletions
- **Warning**: `#F59E0B` (Amber) - Cautions
- **Background**: `#ffffff` (Light) / `#151718` (Dark)

### Layout Structure
- **Header**: Fixed navigation with logout button
- **Tab Navigation**: 5 main sections (Sales, Statistics, Purchases, Buyers, Payments)
- **Content Area**: Responsive grid layout (1 col mobile, 2-4 cols desktop)
- **Cards**: Consistent card design with shadows and borders
- **Tables**: Responsive tables with hover effects

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (md), 1024px (lg)
- Touch-friendly buttons and inputs
- Horizontal scrolling for tables on mobile

---

## 🏗️ Application Architecture

### Component Structure
```
App.vue (Main container)
├── LoginPage.vue (Authentication)
├── SalesPage.vue (Daily sales management)
├── StatisticsPage.vue (Financial overview)
├── PurchasesPage.vue (Vendor purchases)
├── BuyersPage.vue (Customer management)
└── PaymentsPage.vue (Payment recording)
```

### Services Layer
```
services/
├── auth.ts (Authentication logic)
├── storage.ts (LocalStorage management)
└── business.ts (Business calculations)
```

### Type Definitions
```
types/
└── index.ts (All TypeScript interfaces)
```

---

## 📊 Data Models

### User Model
```typescript
{
  id: number
  username: string
  email: string
  name: string
  role: 'accountant' | 'manager' | 'customer'
  isPermanentCustomer: boolean
  creditLimit?: number
  createdAt: string
}
```

### Invoice (Sales) Model
```typescript
{
  id: number
  userId: number
  invoiceDate: string (YYYY-MM-DD)
  amount: number
  notes?: string
  paymentStatus: 'pending' | 'partial' | 'paid'
  paymentMethodId?: number
  createdAt: string
}
```

### Purchase Model
```typescript
{
  id: number
  supplier: string
  amount: number
  paymentMethodId?: number
  purchaseDate: string (YYYY-MM-DD)
  notes?: string
  createdAt: string
}
```

### Payment Model
```typescript
{
  id: number
  userId: number
  invoiceId?: number
  amount: number
  paymentMethodId?: number
  paymentDate: string (YYYY-MM-DD)
  createdAt: string
}
```

### Payment Method Model
```typescript
{
  id: number
  name: string
  type: 'cash' | 'app' | 'transfer'
  description?: string
  isActive: boolean
  owner?: string (For app-based payments)
}
```

---

## 🎨 Screen Designs

### 1. Login Screen
- **Purpose**: User authentication
- **Elements**:
  - Logo/Title
  - Username input
  - Password input
  - Login button
  - Demo credentials display
- **Validation**: Required fields, error messages
- **Demo Accounts**:
  - hamoda / hamoda123
  - ibrahim / ibrahim123
  - abdelhadi / abdelhadi123
  - ahmad / ahmad123

### 2. Sales Screen
- **Purpose**: Record daily sales transactions
- **Sections**:
  - Add Sale Form (Customer, Amount, Payment Method)
  - Sales List (Table with all today's sales)
  - Daily Summary (Total, Cash, App sales)
- **Features**:
  - Customer autocomplete
  - Payment method selection
  - Delete sales option
  - Real-time calculations

### 3. Statistics Screen
- **Purpose**: Financial overview and reporting
- **Metrics**:
  - Yesterday's Cash Box
  - Today's Cash Box
  - Daily Income
  - Total Daily Sales
  - Sales by Payment Method
  - Daily Payments Summary
  - Purchase Breakdown
- **Design**: Grid of metric cards with color coding

### 4. Purchases Screen
- **Purpose**: Track vendor purchases
- **Sections**:
  - Add Purchase Form
  - Purchases List (Table)
  - Purchase Summary
- **Features**:
  - Supplier name input
  - Amount and payment method
  - Delete purchases
  - Daily totals

### 5. Buyers Screen
- **Purpose**: Manage customer relationships and debt
- **Features**:
  - Customer search
  - Debt display
  - Credit limit visualization
  - Debt percentage progress bar
  - Color-coded status (Red if >90%)
- **Design**: Card-based grid layout

### 6. Payments Screen
- **Purpose**: Record customer debt payments
- **Sections**:
  - Payment Form (Customer, Amount, Method)
  - Payments List (Table)
  - Daily Total
- **Features**:
  - Customer dropdown
  - Payment method selection
  - Time tracking
  - Daily summary

---

## 💾 Data Persistence

### LocalStorage Keys
- `store_users` - All users
- `store_invoices` - Sales transactions
- `store_purchases` - Vendor purchases
- `store_payments` - Customer payments
- `store_payment_methods` - Payment method definitions
- `store_reminders` - Debt reminders
- `store_current_user` - Currently logged-in user

### Dummy Data
- 4 Users (3 accountants + 1 manager)
- 3 Customers with credit limits
- 7 Payment methods (1 cash + 6 app-based)
- Sample invoices, purchases, and payments

---

## 🔐 Authentication

### Login Flow
1. User enters username and password
2. Credentials validated against hardcoded list
3. User object stored in localStorage
4. App navigates to main interface
5. Logout clears user from localStorage

### Security Notes
- Passwords stored in plain text (demo only)
- Use proper hashing in production
- Implement JWT tokens for backend
- Add HTTPS requirement

---

## 📈 Business Logic

### Key Calculations
- **Customer Debt** = Total Invoices - Total Payments
- **Daily Sales** = Sum of all invoices for date
- **Daily Income** = Today's Cash + Debt Payments - Yesterday's Cash - Cash Purchases
- **Debt Percentage** = (Customer Debt / Credit Limit) × 100

### Alerts & Reminders
- Alert when customer debt ≥ 90% of credit limit
- Daily reminder for overdue payments
- Low stock warnings (future feature)

---

## 🚀 Features Implemented

### Phase 1 (Current)
- ✅ User authentication
- ✅ Sales management
- ✅ Purchase tracking
- ✅ Customer debt tracking
- ✅ Payment recording
- ✅ Financial statistics
- ✅ LocalStorage persistence
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Arabic language support

### Phase 2 (Planned)
- Backend API integration
- Cloud data sync
- Push notifications
- PDF report generation
- Advanced analytics
- Multi-user permissions
- Audit logging

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 768px | 1 column, stacked |
| Tablet | 768px - 1024px | 2 columns |
| Desktop | > 1024px | 3-4 columns |

---

## 🎯 User Workflows

### Daily Sales Workflow
1. Login with credentials
2. Click "المبيعات" (Sales) tab
3. Select customer from dropdown
4. Enter amount
5. Choose payment method
6. Click "إضافة مبيعة" (Add Sale)
7. View today's sales list
8. Check daily summary

### Customer Debt Management
1. Click "العملاء" (Buyers) tab
2. View all customers with debt
3. See debt percentage vs credit limit
4. Red progress bar indicates >90% debt
5. Click customer for detailed view (future)

### Payment Recording
1. Click "الدفعات" (Payments) tab
2. Select customer
3. Enter payment amount
4. Choose payment method
5. Click "تسجيل دفعة" (Record Payment)
6. Verify in payments list

---

## 🔄 Data Flow

```
User Input
    ↓
Validation
    ↓
Business Logic (calculations)
    ↓
StorageService (localStorage)
    ↓
UI Update (reactive)
    ↓
Display to User
```

---

## 📝 Future Enhancements

1. **Backend Integration**
   - REST API for data sync
   - Real-time updates via WebSocket
   - User authentication via JWT

2. **Advanced Features**
   - Inventory management
   - Expense tracking
   - Employee management
   - Multi-store support

3. **Reporting**
   - PDF export
   - Email reports
   - Custom date ranges
   - Trend analysis

4. **Mobile App**
   - React Native version
   - Offline-first sync
   - Barcode scanning
   - Receipt printing

---

## 🧪 Testing Checklist

- [ ] Login with all demo accounts
- [ ] Add sales transactions
- [ ] View daily statistics
- [ ] Record purchases
- [ ] Check customer debt
- [ ] Record payments
- [ ] Verify calculations
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Verify data persistence (refresh page)
- [ ] Test delete operations
- [ ] Check error handling

---

## 📚 File Structure

```
elegant-store-vue/
├── src/
│   ├── App.vue (Main component)
│   ├── main.js (Entry point)
│   ├── style.css (Tailwind directives)
│   ├── pages/
│   │   ├── LoginPage.vue
│   │   ├── SalesPage.vue
│   │   ├── StatisticsPage.vue
│   │   ├── PurchasesPage.vue
│   │   ├── BuyersPage.vue
│   │   └── PaymentsPage.vue
│   ├── services/
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── business.ts
│   └── types/
│       └── index.ts
├── public/
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

**Design Status**: Ready for Review
**Last Updated**: March 25, 2026
**Version**: 1.0.0
