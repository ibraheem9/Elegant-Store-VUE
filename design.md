# Store Management App - Design Specifications

## Design Philosophy
This mobile app follows **Apple Human Interface Guidelines (HIG)** and is optimized for **portrait orientation (9:16)** with **one-handed usage** in mind. All screens are designed to feel like a first-party iOS app with clear information hierarchy and intuitive navigation.

## Screen List

### 1. Login Screen
- **Purpose**: Authenticate users (accountants and system managers)
- **Content**: 
  - App logo/title
  - Username input field
  - Password input field
  - Login button
  - Error message display
- **Functionality**: Validate credentials and store session in localStorage

### 2. Daily Sales Screen (Home)
- **Purpose**: Record and view daily sales transactions
- **Content**:
  - Date picker (auto-set to today)
  - List of today's sales transactions
  - Each transaction shows: customer name, amount, timestamp
  - Add new sale button (floating action button)
  - Total sales for the day (header)
- **Functionality**: Add, view, edit, delete sales transactions

### 3. Statistics Screen
- **Purpose**: Display daily financial summary
- **Content**:
  - Today's cash total
  - Previous day's cash total
  - Today's income (calculated)
  - Cash from sales
  - App payments total
  - Purchases total
  - Summary cards with key metrics
- **Functionality**: Auto-calculate from transactions

### 4. Purchases Screen
- **Purpose**: Track vendor purchases
- **Content**:
  - List of purchases with vendor name, amount, date
  - Add new purchase button
  - Purchase details: vendor name, amount, notes, date
  - Total purchases display
- **Functionality**: Add, view, edit, delete purchases

### 5. Buyers Screen
- **Purpose**: Manage customer credit/debt
- **Content**:
  - List of customers with current debt
  - Color coding: red for high debt (>90% of limit)
  - Search by customer name
  - Customer detail view with:
    - Total debt amount
    - Debt limit
    - Recent purchases on credit
    - Payment history
  - Add new buyer button
- **Functionality**: Add customers, track debt, set debt limits, view purchase history

### 6. Payments Screen
- **Purpose**: Record and verify payments
- **Content**:
  - List of payments by date
  - Payment method (cash, app payment)
  - Amount and customer name
  - Date and timestamp
  - Payment status
  - Add new payment button
- **Functionality**: Record payments, verify against invoices, track payment methods

## Primary Content and Functionality

### Data Structure
- **Sales**: Customer name, amount, date, payment method (cash/app)
- **Purchases**: Vendor name, amount, date, notes
- **Buyers**: Name, total debt, debt limit, purchase history
- **Payments**: Customer name, amount, date, method, invoice reference

### Key User Flows

**Flow 1: Record Daily Sale**
1. User taps "Add Sale" button on Daily Sales screen
2. Modal appears with form (customer name, amount, date)
3. User enters data and submits
4. Sale is saved to localStorage and appears in list
5. Daily total updates automatically

**Flow 2: Track Customer Debt**
1. User navigates to Buyers screen
2. Taps on customer to view details
3. Views current debt and limit
4. Can record payment or view purchase history
5. Debt is updated in real-time

**Flow 3: End-of-Day Statistics**
1. User navigates to Statistics screen
2. Views today's cash total, previous day total
3. Sees breakdown of sales, purchases, payments
4. Can export or print summary

## Color Choices

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Primary | Teal | #0a7ea4 | Buttons, active states, accents |
| Background | White | #ffffff | Light mode background |
| Dark Background | Dark Gray | #151718 | Dark mode background |
| Foreground | Dark Text | #11181C | Primary text |
| Muted | Gray | #687076 | Secondary text |
| Success | Green | #22C55E | Positive actions, confirmations |
| Warning | Orange | #F59E0B | Caution, alerts |
| Error/Debt | Red | #EF4444 | High debt, errors, critical info |
| Surface | Light Gray | #f5f5f5 | Cards, elevated surfaces |
| Border | Light Border | #E5E7EB | Dividers, borders |

## Mobile-First Principles

- **Thumb-friendly**: All interactive elements positioned within thumb reach
- **Minimal scrolling**: Content fits within viewport when possible
- **Clear hierarchy**: Most important info at top, actions at bottom
- **Consistent spacing**: 16px base unit for padding/margins
- **Large touch targets**: Minimum 44x44pt for interactive elements
- **Dark mode support**: All colors automatically adapt to light/dark mode

## Navigation Structure

- **Tab Bar** (bottom): 5 main tabs
  - Home (Daily Sales)
  - Statistics
  - Purchases
  - Buyers
  - Payments
- **Modal dialogs**: For adding/editing transactions
- **Detail screens**: For viewing customer/payment details
- **Settings**: Accessible from header (user profile, logout)
