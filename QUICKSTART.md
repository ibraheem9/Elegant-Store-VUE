# 🚀 Quick Start Guide - 5 Minutes Setup

Get the Store Management App running on your local machine in just 5 minutes!

---

## ⚡ Prerequisites

Make sure you have installed:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

Check your versions:
```bash
node --version
npm --version
git --version
```

---

## 📥 Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/ibraheem9/Elegant-Store-VUE.git
cd Elegant-Store-VUE

# Install dependencies
npm install
```

---

## ▶️ Step 2: Start the App (1 minute)

```bash
npm run dev
```

The app will start and display:
- 🌐 **Web URL**: http://localhost:8081
- 📱 **QR Code**: For Expo Go on your phone

---

## 🔐 Step 3: Login (1 minute)

Use any of these demo accounts:

```
Username: hamoda
Password: hamoda123
```

Or try:
- `ibrahim` / `ibrahim123`
- `abdelhadi` / `abdelhadi123`
- `ahmad` / `ahmad123`

---

## 📱 Step 4: Test on Your Phone (1 minute)

### Option A: Web Browser
1. Open http://localhost:8081 in your browser
2. You're done! 🎉

### Option B: Mobile Device
1. Install [Expo Go](https://expo.dev/client) on your phone
2. Scan the QR code shown in your terminal
3. App opens automatically in Expo Go

---

## 🎯 What to Try First

1. **Add a Sale** - Go to "المبيعات" (Sales) tab and click "+ إضافة مبيعة جديدة"
2. **Check Statistics** - Go to "الإحصائيات" (Statistics) to see daily totals
3. **Add a Customer** - Go to "العملاء" (Buyers) and add a new customer
4. **Record a Payment** - Go to "الدفعات" (Payments) and record a payment

---

## 🛑 Stop the App

Press `Ctrl + C` in your terminal

---

## 🐛 Troubleshooting

**Port 8081 already in use?**
```bash
# Kill the process
lsof -ti:8081 | xargs kill -9
npm run dev
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**App not loading?**
```bash
npm run check  # Check for errors
npm run dev    # Restart
```

---

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [app/(tabs)/index.tsx](./app/(tabs)/index.tsx) to understand the code
- Explore the [lib/storage.ts](./lib/storage.ts) to see how data is stored

---

## 💡 Tips

- **Dummy data** is automatically loaded on first launch
- **All data is stored locally** - no internet needed
- **Dark mode** works automatically based on your device settings
- **Arabic language** is fully supported with RTL layout

---

**Happy coding! 🚀**

For more help, see [README.md](./README.md)
