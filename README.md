# Store Management Application - Vue 3 + Vite + Tailwind

A professional web application for managing daily store operations with offline support using localStorage.

## ✨ Features

- 🔐 **User Authentication** - 4 demo accounts (accountants & manager)
- 💰 **Sales Management** - Record daily sales with payment methods
- 📊 **Financial Statistics** - Real-time dashboard with key metrics
- 🛒 **Purchase Tracking** - Manage vendor purchases
- 👥 **Customer Management** - Track customer debt and credit limits
- 💳 **Payment Recording** - Record customer debt payments
- 💾 **Offline Support** - All data stored in localStorage
- 🌙 **Dark Mode** - Automatic theme switching
- 🌍 **Arabic Support** - Full RTL interface
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/pnpm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/ibraheem9/Elegant-Store-VUE.git
cd elegant-store-vue

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🔑 Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| hamoda | hamoda123 | Accountant |
| ibrahim | ibrahim123 | Manager |
| abdelhadi | abdelhadi123 | Accountant |
| ahmad | ahmad123 | Accountant |

## 📁 Project Structure

```
src/
├── App.vue                 # Main application component
├── main.js                 # Entry point
├── style.css              # Tailwind CSS styles
├── pages/
│   ├── LoginPage.vue      # Authentication screen
│   ├── SalesPage.vue      # Daily sales management
│   ├── StatisticsPage.vue # Financial overview
│   ├── PurchasesPage.vue  # Vendor purchases
│   ├── BuyersPage.vue     # Customer management
│   └── PaymentsPage.vue   # Payment recording
├── services/
│   ├── auth.ts            # Authentication logic
│   ├── storage.ts         # LocalStorage management
│   └── business.ts        # Business calculations
└── types/
    └── index.ts           # TypeScript interfaces
```

## 🎯 Main Features

### Sales Management
- Add daily sales transactions
- Select customers from list
- Choose payment methods (cash or app-based)
- View daily sales summary
- Track cash vs app-based sales

### Financial Statistics
- Yesterday's cash box balance
- Today's cash box balance
- Daily income calculation
- Sales breakdown by payment method
- Purchase summary
- Debt payment tracking

### Customer Management
- View all permanent customers
- Track customer debt
- Monitor credit limit usage
- Visual debt percentage indicator
- Alert when debt exceeds 90% of limit

### Purchase Tracking
- Record vendor purchases
- Track by supplier
- Payment method selection
- Daily purchase totals

### Payment Recording
- Record customer debt payments
- Select payment method
- Track payment history
- Daily payment totals

## 💾 Data Storage

All data is stored in browser's localStorage with the following keys:
- `store_users` - User accounts
- `store_invoices` - Sales transactions
- `store_purchases` - Vendor purchases
- `store_payments` - Customer payments
- `store_payment_methods` - Payment method definitions
- `store_current_user` - Currently logged-in user

**Note**: Data persists across browser sessions but is cleared if browser cache is cleared.

## 🎨 Design

### Color Scheme
- **Primary**: Teal (#0a7ea4)
- **Secondary**: Dodger Blue (#1e90ff)
- **Success**: Green (#22C55E)
- **Danger**: Red (#EF4444)
- **Warning**: Amber (#F59E0B)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **LocalStorage API** - Browser data persistence

## 📦 Build for Production

```bash
npm run build
# or
pnpm build
```

Output will be in the `dist/` directory.

## 🔄 Development Workflow

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port.

### localStorage Not Working
- Check if browser has localStorage enabled
- Clear browser cache and try again
- Try in a different browser

### Styling Issues
- Make sure Tailwind CSS is properly imported in `src/style.css`
- Clear browser cache
- Restart dev server

## 📝 Demo Data

The application comes pre-loaded with sample data:
- 4 user accounts
- 3 permanent customers with credit limits
- 7 payment methods (1 cash + 6 app-based)
- Sample sales, purchases, and payments for today

## 🔐 Security Notes

**Important**: This is a demo application. For production use:
- Implement proper authentication (OAuth, JWT)
- Use secure password hashing
- Add HTTPS encryption
- Implement proper authorization
- Add audit logging
- Use a backend database instead of localStorage

## 📱 Mobile Optimization

- Touch-friendly buttons and inputs
- Responsive grid layouts
- Horizontal scroll for tables
- Optimized for portrait orientation
- Works offline with localStorage

## 🌍 Internationalization

The application supports Arabic language with:
- RTL (Right-to-Left) text direction
- Arabic date/time formatting
- Arabic UI labels and messages

## 📞 Support

For issues or questions, please create an issue on the GitHub repository.

## 📄 License

This project is provided as-is for demonstration purposes.

## 🎓 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Version**: 1.0.0  
**Last Updated**: March 25, 2026  
**Status**: Ready for Design Review
