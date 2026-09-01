# Fixora – On-Demand Home Services & Care Platform

Fixora is a mobile application built with React Native that connects customers with trusted service providers for home maintenance, cleaning, electrical/plumbing, appliance repair, elderly care, child care, and personal assistance.

---

## 📱 Features & Screens Overview

### 1. 🔑 Authentication & Role Management
- **Splash Screen** (`src/screens/SplashScreen.tsx`): App branding with tagline *"Trusted Services. Caring People. Better Homes."*
- **Login Screen** (`src/screens/LoginScreen.tsx`):
  - Support for **Customer** and **Service Provider** logins.
  - Role toggle switcher (`Customer` vs `Service Provider`).
  - Pre-filled **Quick Demo Sign-In** buttons for instant testing.
  - Form validation for email/phone and password.
- **Registration Screen** (`src/screens/RegisterScreen.tsx`):
  - Complete user registration form (Full Name, Email Address, Phone Number, Primary Address, Password, Confirm Password, Role Selection).
  - Validation for missing fields and matching passwords.
  - Upon registration, automatically creates the user session and redirects to the Home Dashboard or Provider Dashboard.

---

### 2. 🏠 Home & Family Care Hub
- **Home Dashboard** (`src/screens/HomeScreen.tsx`):
  - User greeting with active address bar and notification badge.
  - Global service search bar.
  - Promotional care discount banner (e.g. ₹1,245 off first booking).
  - Category shortcuts & horizontal cards.
  - **Dedicated Elder Care Highlight Card**: Direct access to senior companion care, doctor visit escort, and emergency helpline.
  - **Dedicated Child Care Highlight Card**: Direct access to background-verified babysitters and tutors.
  - **Active Booking Tracker Card**: Displays live status of current active bookings.
- **Dedicated Elder Care Screen** (`src/screens/ElderCareScreen.tsx`): High-contrast, accessible layout with senior companion care, daily living assistance, medication reminders, doctor visit escorts, overnight caregivers, medical disclaimer alert, and 24/7 priority emergency line.
- **Dedicated Child Care Screen** (`src/screens/ChildCareScreen.tsx`): Babysitters, infant specialists, school pickup/drop, homework tutors, age group badges (`0-2 yrs`, `3-6 yrs`, `7+ yrs`), and background safety verification commitment.

---

### 3. 👨‍🔧 Service Provider Profiles & 5-Step Booking Flow
- **Provider Profile Screen** (`src/screens/ProviderProfileScreen.tsx`): Detailed provider bio, experience years, verified background check badge, qualifications, certifications, languages spoken, service area, starting rate, and customer reviews list.
- **5-Step Booking Flow** (`src/screens/BookingFlowScreen.tsx`):
  1. **Summary**: Selected service & provider overview.
  2. **Select Date**: Interactive date selector.
  3. **Select Time Slot**: Time slot selection.
  4. **Service Address**: Street address, landmark/access code, and special instructions.
  5. **Review & Confirm**: Cost breakdown, safety fee, total payable, and **Confirm Booking** trigger with unique `FIX-XXXX` Booking ID generation.

---

### 4. ⚡ Tracker, Bookings, Favourites & Provider Dashboard
- **Booking Details & Status Tracker** (`src/screens/BookingDetailsScreen.tsx`):
  - Visual status stepper (`Confirmed` → `Provider Assigned` → `On the Way` → `Service Started` → `Completed`).
  - Simulation controls to test real-time status transitions.
  - Rating & Review modal submission.
- **Bookings Tab** (`src/screens/BookingsScreen.tsx`): Categorized by `Upcoming`, `Ongoing`, and `Completed / History`.
- **Favourites Screen** (`src/screens/FavouritesScreen.tsx`): Saved providers and services.
- **Notifications Screen** (`src/screens/NotificationsScreen.tsx`): Real-time system & booking alerts with unread count badge.
- **Profile Screen** (`src/screens/ProfileScreen.tsx`): Account details, saved addresses, role switcher, help & support line, and logout.
- **Provider Dashboard** (`src/screens/ProviderDashboardScreen.tsx`): Provider view with earnings total, completed job metrics, real-time availability toggle (`Available` vs `Busy`), and incoming job status action buttons (`On the Way`, `Start Job`, `Complete`).

---

## 💾 Where is Data Stored?

In the current application architecture, data is managed and stored as follows:

1. **In-Memory Centralized React State Management (`src/context/AppContext.tsx`)**:
   - Application data (users, active user session, role, active tab, bookings list, favourite provider IDs, favourite service IDs, notifications, and customer reviews) is stored in top-level React state provided by `AppProvider`.
   - Any new user created via the **Registration Screen** (`RegisterScreen.tsx`) is immediately added to state (`setUser(...)`), setting their profile name, email, phone, role, and address.
   - Any new booking created via the 5-step booking wizard is prepended to `bookings` state (`addBooking(...)`) and stored dynamically during the app session.
   - Any rating or review submitted via the rating modal is added to `providers` state (`addReview(...)`), updating the provider's overall star rating and review list in real-time.

2. **Mock Data Base Engine (`src/data/mockData.ts`)**:
   - Initial seed data (categories, initial services, verified service providers, seed bookings, and notifications) is defined in [`src/data/mockData.ts`](file:///d:/react/TestApp/src/data/mockData.ts).
   - This provides realistic pre-populated data for instant testing across home services, elder care, and child care.

3. **Persistent Backend Integration (Production Ready)**:
   - The state management functions in `AppContext.tsx` (`login`, `register`, `addBooking`, `updateBookingStatus`, `addReview`, `toggleFavouriteProvider`) are modularly designed with clean interfaces so they can easily be hooked up to an external database (e.g. Firebase Firestore, Supabase, PostgreSQL, or REST API/GraphQL backend).

---

## 🛠️ How to Run the App

1. **Start Metro Bundler**:
   ```bash
   npm start
   ```

2. **Run on Android Emulator**:
   ```bash
   npm run android
   ```

3. **Port Forwarding (ADB)**:
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

Stop-Process -Name node -Force
adb kill-server

emulator -avd Pixel_6     
adb emu kill
                
npm start
npx react-native run-android