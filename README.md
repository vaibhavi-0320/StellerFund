<div align="center">

# 🚀 StellarFund

### Decentralized Freelance Escrow Platform on Stellar

[![Stellar](https://img.shields.io/badge/Stellar-Network-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart_Contract-00D1FF?style=for-the-badge)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Rust](https://img.shields.io/badge/Rust-Contract-CE422B?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)

**[Live Demo](https://stellarfund.vercel.app)** • **[Contract Explorer](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS)** • **[Documentation](#-documentation)**

</div>


---

## 🌟 Overview

**StellarFund** is a production-grade decentralized escrow platform built on the Stellar blockchain, utilizing Soroban smart contracts to provide trustless, transparent, and secure payment infrastructure for freelance work.

### Why StellarFund?

- 🔒 **Trustless Escrow** - No intermediaries
- ⚡ **Instant Settlement** - 3-5 second finality
- 💰 **Low Fees** - Fractions of a cent
- 🌐 **Global Access** - Anyone, anywhere
- 🔍 **Full Transparency** - On-chain verification

---

## 🥋 Stellar Journey to Mastery

<div align="center">

| Badge | Level | Status | Key Features |
|:---:|:---|:---:|:---|
| ⚪ | White Belt | ✅ Complete | Wallet integration, XLM transactions |
| 🟡 | Yellow Belt | ✅ Complete | Smart contracts, error handling, frontend calls |
| 🟠 | Orange Belt | 🔄 In Progress | Multi-sig, events, advanced patterns |

</div>

### ⚪ White Belt Requirements

```
✅ Connect Freighter wallet
✅ Display XLM balance
✅ Send XLM payments
✅ Transaction confirmation
✅ Error handling
```

### 🟡 Yellow Belt Requirements

```
✅ Deploy Soroban contract on testnet
✅ 3+ error types handled
✅ Frontend calls contract
✅ Transaction status visible
✅ Professional structure
✅ 2+ meaningful commits
```

**Contract Address:** `CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS`  
**[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS)**

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Security
- Soroban smart contracts
- Authorization checks
- Status management
- Error handling

</td>
<td width="50%">

### 💼 User Experience
- Wallet integration
- Real-time balance
- Transaction preview
- Stellar Expert links

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Smart Contract

![Rust](https://img.shields.io/badge/Rust-1.70+-CE422B?style=flat-square&logo=rust&logoColor=white)
![Soroban](https://img.shields.io/badge/Soroban_SDK-21.0.0-00D1FF?style=flat-square)
![WASM](https://img.shields.io/badge/WebAssembly-654FF0?style=flat-square&logo=webassembly&logoColor=white)

### Frontend

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-06B6D4?style=flat-square&logo=tailwindcss)

### Blockchain

![Stellar](https://img.shields.io/badge/Stellar-Testnet-7D00FF?style=flat-square&logo=stellar)
![Freighter](https://img.shields.io/badge/Freighter-Wallet-FF6B6B?style=flat-square)
![SDK](https://img.shields.io/badge/Stellar_SDK-11.3.0-00D1FF?style=flat-square)

</div>

---

## 🚀 Quick Start

### Prerequisites

```bash
✅ Rust & Cargo (1.70+)
✅ Node.js & npm (18+)
✅ Stellar CLI
✅ Freighter Wallet
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/StellarFund.git
cd StellarFund

# 2. Add WASM target
rustup target add wasm32-unknown-unknown

# 3. Create testnet account
stellar keys generate my-account --network testnet
stellar keys fund my-account --network testnet

# 4. Build & deploy contract
stellar contract build
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
  --source my-account \
  --network testnet

# 5. Update CONTRACT_ID in src/lib/freighter.js

# 6. Install & run
npm install
npm run dev
```

**Open http://localhost:3001** 🎉

---

## 📁 Project Structure

```
stellarfund/
├── contracts/stellar_fund/
│   └── src/
│       ├── lib.rs              # Contract logic
│       └── test.rs             # Unit tests
├── src/
│   ├── components/
│   │   └── Header.jsx          # Navigation
│   ├── lib/
│   │   └── freighter.js        # Wallet integration
│   ├── App.jsx                 # Main app
│   └── main.jsx                # Entry point
└── public/
    └── index.html
```

---

## 📜 Smart Contract

### Functions

#### 1. Create Escrow

```rust
pub fn create_escrow(
    env: Env,
    client: Address,
    freelancer: Address,
    amount: i128,
) -> Result<u64, Error>
```

Lock funds for freelance work. Returns escrow ID.

**CLI:**
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source my-account \
  --network testnet \
  -- \
  create_escrow \
  --client GA... \
  --freelancer GB... \
  --amount 10000000
```

#### 2. Release Payment

```rust
pub fn release_payment(
    env: Env,
    client: Address,
    id: u64,
) -> Result<(), Error>
```

Release funds to freelancer. Only client can call.

#### 3. Refund

```rust
pub fn refund(
    env: Env,
    client: Address,
    id: u64,
) -> Result<(), Error>
```

Cancel and refund client.

#### 4. Get Escrow

```rust
pub fn get_escrow(
    env: Env,
    id: u64,
) -> Result<Escrow, Error>
```

View escrow details (public).

### Error Types

```rust
pub enum Error {
    EscrowNotFound = 1,     // Invalid ID
    NotAuthorized = 2,      // Wrong caller
    AlreadyCompleted = 3,   // Already processed
    InvalidAmount = 4,      // Amount ≤ 0
}
```

---

## 🌐 Frontend Integration

### Wallet Connection

```javascript
import { isConnected, getPublicKey } from '@stellar/freighter-api';

export async function connectWallet() {
  const connected = await isConnected();
  if (!connected) throw new Error('Install Freighter');
  return await getPublicKey();
}
```

### Contract Call Example

```javascript
const contract = new StellarSdk.Contract(CONTRACT_ID);

const tx = new StellarSdk.TransactionBuilder(account, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: StellarSdk.Networks.TESTNET
})
.addOperation(
  contract.call('create_escrow', 
    StellarSdk.Address.fromString(client).toScVal(),
    StellarSdk.Address.fromString(freelancer).toScVal(),
    StellarSdk.nativeToScVal(amount, { type: 'i128' })
  )
)
.setTimeout(30)
.build();
```

---

## 🚢 Deployment

### Contract Deployment

```bash
# Build
stellar contract build

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
  --source my-account \
  --network testnet

# Verify
https://stellar.expert/explorer/testnet/contract/YOUR_CONTRACT_ID
```

### Frontend Deployment

```bash
npm run build
# Deploy dist/ to Vercel/Netlify
```

---

## 🧪 Testing

```bash
# Run tests
cargo test

# With output
cargo test -- --nocapture
```

### Test Coverage

```
✅ test_create_escrow
✅ test_release_payment
✅ test_refund
✅ test_invalid_amount
✅ test_unauthorized
✅ test_double_completion
```

---

## 📚 Documentation

- **[Stellar Docs](https://developers.stellar.org)**
- **[Soroban Docs](https://soroban.stellar.org/docs)**
- **[Freighter Wallet](https://docs.freighter.app)**
- **[Stellar Expert](https://stellar.expert)**

---

<div align="center">

### 🌟 Built with ❤️ on Stellar

[![Stellar](https://img.shields.io/badge/Stellar-Network-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**[⬆ Back to Top](#-stellarfund)**

</div>
