# StellarFund

A Stellar wallet app for testnet transactions.

## Setup

```bash
npm install
npm run dev
```

## Usage

1. Open Freighter wallet extension
2. Switch to Testnet
3. Fund account with Friendbot
4. Connect wallet in the app
5. Send XLM to any address

## Project Structure

```
src/
  components/
    Header.jsx       - Wallet connection header
    SendXLM.jsx      - Transaction form
  lib/
    freighter.js     - Freighter wallet functions
  App.jsx            - Main app component
  App.css            - Styles
```

## Requirements

- Node.js 14+
- Freighter wallet extension
- Stellar testnet account
