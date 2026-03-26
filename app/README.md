# Transaction Management Mobile

A React Native (Expo) app that integrates with the Transaction Management API. Lets you submit transactions, view history, and manage multiple accounts.

## Tech Stack

- React Native + Expo SDK 52
- TypeScript
- React Navigation (bottom tabs + stack)
- React Native Paper (Material Design components)
- Context API + useReducer for state management

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo dev server
npm run start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run tests
npm test
```

## Project Structure

```
├── api/             # API client and endpoint functions
├── components/      # Reusable UI components
├── constants/       # Colors, layout, and config
├── context/         # App-wide state (Context + Reducer)
├── hooks/           # Custom React hooks
├── navigation/      # Tab and stack navigation setup
├── screens/         # Screen components (Transactions, History, Settings)
└── App.tsx          # Root component with providers
```

## Building for iOS Simulator

```bash
npx expo run:ios
```

This produces a `.app` file in the `ios/build/` directory that can be run on the iOS Simulator.

---

Made by [Alva Labs](https://alvalabs.io).
