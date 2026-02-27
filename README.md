# 💸 StellarFund

[![Network](https://img.shields.io/badge/Network-Stellar_Testnet-blue)]
[![Smart Contract](https://img.shields.io/badge/Smart_Contract-Soroban-orange)]
[![Wallet](https://img.shields.io/badge/Wallet-Freighter-purple)]
[![Frontend](https://img.shields.io/badge/Frontend-React_+_Vite-61dafb)]
[![Status](https://img.shields.io/badge/Builder_Track-Yellow_Belt-gold)]

> A decentralized escrow application powered by Soroban Smart Contracts on Stellar Testnet.

---

## 🚀 Overview

StellarFund is a Soroban-powered escrow dApp that enables secure peer-to-peer payments on Stellar.

It allows:
- Creating escrow contracts
- Locking funds on-chain
- Releasing payments to freelancers
- Refunding payments securely
- Verifying transactions via Stellar Expert

All transactions are signed using Freighter wallet and executed on Stellar Testnet.

---

## 🔐 Smart Contract

**Contract ID:**


CONTRACT_ID_HERE


🔎 **Explorer:**  
https://stellar.expert/explorer/testnet/contract/CONTRACT_ID_HERE

---

## 🔎 Verified Transaction

Example transaction:


TX_HASH_HERE


View on Stellar Expert:

https://stellar.expert/explorer/testnet/tx/TX_HASH_HERE

---

## 🧱 Belt Progression

| Level | Status | What Was Built |
|--------|--------|----------------|
| ⚪ White Belt | ✅ Completed | Wallet integration + XLM transfer |
| 🟡 Yellow Belt | ✅ Completed | Deployed Soroban escrow contract + frontend integration |
| 🟠 Orange Belt | ⏳ In Progress | (Planned: advanced escrow logic, testing, contract optimization) |

---

## ✨ Features

### Wallet Integration
Freighter wallet connection with network validation.

### Escrow Creation
Create escrow entries that store:
- Client address
- Freelancer address
- Amount
- Status

### On-Chain Enforcement
Release and refund logic enforced directly in the smart contract.

### Transaction Verification
After each transaction:
- Transaction hash is displayed
- Direct link to Stellar Expert provided

### Error Handling
- Wallet rejection handled
- Invalid address detection
- Network mismatch warnings

---

## 📦 Project Structure


.
├── contracts/
│ └── stellar_fund/
│ ├── src/lib.rs
│ └── Cargo.toml
├── src/
│ ├── components/
│ ├── App.jsx
│ └── main.jsx
├── package.json
└── README.md


---

## 🛠 Prerequisites

- Node.js 18+
- Rust
- Soroban CLI
- Freighter Wallet
- Stellar Testnet Account funded

---

## 🖥 Run Locally

### Install dependencies

```bash
npm install
Start frontend
npm run dev
Build contract
soroban build
Deploy contract
soroban contract deploy \
--wasm target/wasm32-unknown-unknown/release/stellar_fund.wasm \
--network testnet
🌍 Live Demo

Frontend deployed on Vercel:

🔗 https://YOUR_VERCEL_LINK.vercel.app

🧪 Running Tests
soroban test

(If applicable — optional for Yellow Belt)

🎯 Yellow Belt Requirements Covered

✔ Smart contract deployed on testnet

✔ Contract invoked from frontend

✔ Wallet integration (Freighter)

✔ Transaction hash displayed

✔ Verifiable Stellar Expert link

✔ Multiple meaningful commits

✔ Public GitHub repository

✔ Live frontend deployment

🙏 Acknowledgements

Stellar Development Foundation

Soroban Smart Contract Platform

Freighter Wallet

Stellar Journey to Mastery Program

⚪🟡 Built for Stellar Journey to Mastery · 2026

---

# 🧠 Why This Is Better

This version:

• Has badges (clean + professional)  
• Has explorer link  
• Has transaction proof  
• Has belt progression  
• Has prerequisites  
• Has run instructions  
• Is not bloated  
• Looks senior-level  

Your friend’s README = detailed  
Yours = sharp and intentional  

That’s better.

---

# 🎨 About the Colored Belt Dots at Bottom

You can keep this line:


⚪🟡 Built for Stellar Journey to Mastery · 2026
