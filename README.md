# متجر - Store Management Mobile App

A professional **React Native mobile application** built with **Expo SDK 54** for managing daily store operations including sales, purchases, customer debt tracking, and financial statistics. The app works completely **offline** with local data storage using AsyncStorage.

![App Icon](./assets/images/icon.png)

---

## 🎯 Features

### Core Functionality
- **Authentication System** - Secure login with demo accounts for testing
- **Daily Sales Tracking** - Record customer sales with payment methods (cash/app)
- **Financial Statistics** - Real-time dashboard with daily totals and comparisons
- **Vendor Purchases** - Track purchases from suppliers with notes
- **Customer Management** - Manage customer debt with visual progress indicators
- **Payment Recording** - Track customer payments with invoice references
- **Offline Support** - All data stored locally, works without internet

### User Experience
- **Mobile-First Design** - Optimized for portrait orientation (9:16)
- **Arabic Language Support** - Full RTL support throughout the app
- **Dark Mode** - Automatic theme switching based on device settings
- **Tab Navigation** - Easy access to 5 main screens
- **Form Validation** - Real-time error checking and user feedback
- **Search Functionality** - Quick customer lookup

### Data Management
- **Complete CRUD Operations** - Create, read, update, and delete transactions
- **Real-Time Calculations** - Automatic financial summaries
- **Debt Tracking** - Visual alerts when customers exceed 90% debt limit
- **Payment Methods** - Support for cash and app-based payments
- **Dummy Data** - Pre-populated with realistic sample data for testing

---

## 📋 System Requirements

### For Development
- **Node.js** - v18.0.0 or higher
- **pnpm** - v9.0.0 or higher (or npm/yarn)
- **Git** - For version control
- **Expo CLI** - For running the app

### For Testing
- **iOS**: Xcode 15+ (macOS only) or Expo Go app
- **Android**: Android Studio or Expo Go app
- **Web**: Any modern browser (Chrome, Safari, Firefox, Edge)

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/ibraheem9/Elegant-Store-VUE.git
cd Elegant-Store-VUE
```

### 2. Install Dependencies

Using **pnpm** (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Start the Development Server

```bash
pnpm dev
```

This command will:
- Start the Metro bundler
- Start the backend development server
- Display a QR code for mobile testing
- Open the web preview (if available)

### 4. Run on Different Platforms

**Web Browser:**
```bash
pnpm dev:metro
```
Then open `http://localhost:8081` in your browser

**iOS (macOS only):**
```bash
pnpm ios
```

**Android:**
```bash
pnpm android
```

**Expo Go (Mobile):**
1. Install [Expo Go](https://expo.dev/client) on your phone
2. Run `pnpm dev`
3. Scan the QR code with your phone camera
4. App opens in Expo Go

---

## 🔐 Demo Credentials

Use these credentials to test the app:

| Username | Password | Role |
|----------|----------|------|
| `hamoda` | `hamoda123` | Accountant |
| `ibrahim` | `ibrahim123` | System Manager |
| `abdelhadi` | `abdelhadi123` | Accountant |
| `ahmad` | `ahmad123` | Accountant |

---

## 📁 Project Structure

```
Elegant-Store-VUE/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab-based navigation screens
│   │   ├── index.tsx             # Daily Sales screen
│   │   ├── statistics.tsx        # Financial Statistics screen
│   │   ├── purchases.tsx         # Vendor Purchases screen
│   │   ├── buyers.tsx            # Customer Management screen
│   │   └── payments.tsx          # Payment Recording screen
│   ├── login.tsx                 # Login screen
│   └── _layout.tsx               # Root layout with providers
├── lib/
│   ├── storage.ts                # LocalStorage utility & dummy data
│   ├── auth-context.tsx          # Authentication context
│   ├── data-context.tsx          # Global data management
│   └── theme-provider.tsx        # Theme switching logic
├── components/
│   ├── screen-container.tsx      # SafeArea wrapper for screens
│   └── ui/                       # Reusable UI components
├── hooks/
│   ├── use-colors.ts             # Theme colors hook
│   ├── use-color-scheme.ts       # Dark mode detection
│   └── use-auth.ts               # Authentication hook
├── assets/images/                # App icons and images
├── app.config.ts                 # Expo configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── theme.config.js               # Color palette configuration
└── package.json                  # Project dependencies
```

---

## 🛠️ Available Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server (Metro + Backend) |
| `pnpm dev:metro` | Start Metro bundler only (web) |
| `pnpm dev:server` | Start backend server only |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm check` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests with Vitest |
| `pnpm ios` | Run on iOS simulator |
| `pnpm android` | Run on Android emulator |
| `pnpm qr` | Generate QR code for Expo Go |

---

## 💾 Data Storage

The app uses **AsyncStorage** for local data persistence. All data is stored on the device and includes:

- **Sales Transactions** - Customer sales with timestamps and payment methods
- **Purchases** - Vendor purchases with notes
- **Customers** - Customer profiles with debt limits
- **Payments** - Payment records with methods and references
- **User Sessions** - Login state and user information

### Dummy Data

The app comes pre-populated with realistic sample data:
- 5 sample customers with varying debt levels
- 10 sample sales transactions
- 5 sample purchases
- 3 sample payments

This data is initialized automatically on first app launch.

---

## 🎨 Customization

### Change App Name
Edit `app.config.ts`:
```typescript
const env = {
  appName: "Your App Name",
  // ...
};
```

### Change Color Scheme
Edit `theme.config.js`:
```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  // ... other colors
};
```

### Change App Icon
Replace these files with your custom icon (1024x1024 PNG):
- `assets/images/icon.png`
- `assets/images/splash-icon.png`
- `assets/images/favicon.png`
- `assets/images/android-icon-foreground.png`

---

## 🧪 Testing

### Run Unit Tests
```bash
pnpm test
```

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Logout clears session

**Sales Screen:**
- [ ] Add new sale with all fields
- [ ] Delete existing sale
- [ ] View daily total
- [ ] Switch payment methods

**Statistics Screen:**
- [ ] View daily cash summary
- [ ] Compare with previous day
- [ ] View daily income
- [ ] See breakdown by payment method

**Purchases Screen:**
- [ ] Add new purchase
- [ ] Delete purchase
- [ ] View daily total
- [ ] Add notes to purchases

**Buyers Screen:**
- [ ] View all customers
- [ ] Search customers
- [ ] Add new customer
- [ ] See debt progress indicators
- [ ] View debt alerts

**Payments Screen:**
- [ ] Record new payment
- [ ] Select payment method
- [ ] Add invoice reference
- [ ] View daily payments total

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution:**
```bash
pnpm install
pnpm check
```

### Issue: Port 8081 already in use
**Solution:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use a different port
EXPO_PORT=8082 pnpm dev
```

### Issue: Data not persisting
**Solution:**
- Clear app cache and reinstall
- Check AsyncStorage permissions
- Verify device storage has space

### Issue: Expo Go not connecting
**Solution:**
1. Ensure phone and computer are on same WiFi
2. Check firewall settings
3. Restart Expo CLI: `pnpm dev`
4. Rescan QR code

### Issue: Dark mode not working
**Solution:**
- Check device theme settings
- Clear app cache
- Restart the app

---

## 📱 Platform-Specific Notes

### iOS
- Requires Xcode 15 or higher
- First run may take longer due to pod installation
- Simulator must be running before `pnpm ios`

### Android
- Requires Android SDK 24 or higher
- Emulator must be running before `pnpm android`
- Check `adb devices` to verify connection

### Web
- Works in all modern browsers
- Local storage used for data persistence
- Some native features unavailable (haptics, camera)

---

## 🔄 Updating Dependencies

To update all dependencies:
```bash
pnpm update
```

To update a specific package:
```bash
pnpm add package-name@latest
```

---

## 📚 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.81 | Mobile framework |
| Expo | 54 | Development platform |
| Expo Router | 6 | Navigation |
| TypeScript | 5.9 | Type safety |
| NativeWind | 4 | Tailwind CSS for React Native |
| React | 19 | UI library |
| AsyncStorage | 2.2 | Local data persistence |

---

## 🚀 Deployment

### Build for Production

**Web:**
```bash
pnpm build
```

**iOS/Android:**
Use Expo's cloud build service:
```bash
eas build --platform ios
eas build --platform android
```

See [Expo Documentation](https://docs.expo.dev/build/introduction/) for detailed deployment instructions.

---

## 📞 Support & Contributing

For issues, questions, or suggestions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [Expo Documentation](https://docs.expo.dev/)
3. Check [React Native Documentation](https://reactnative.dev/)

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev/) - Amazing React Native framework
- [React Native](https://reactnative.dev/) - Cross-platform mobile development
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [Expo Router](https://expo.github.io/router/) - File-based routing

---

## 📝 Notes

- All data is stored locally on the device
- No internet connection required for core functionality
- Data is not synced across devices
- Clearing app cache will reset all data
- Demo accounts are for testing only

---

**Last Updated:** March 24, 2026

**App Version:** 1.0.0

**Expo SDK:** 54

For the latest updates, visit: https://github.com/ibraheem9/Elegant-Store-VUE
