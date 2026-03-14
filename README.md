<div align="center">

<br />

# ⬡ StellarFund

### Trustless Freelance Escrow on the Stellar Blockchain

*Get paid without the trust tax.*

<br />

[![CI](https://github.com/YOUR_USERNAME/stellarfund/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/stellarfund/actions/workflows/ci.yml)
[![Stellar Testnet](https://img.shields.io/badge/Network-Stellar%20Testnet-7D00FF?style=flat-square&logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet)
[![Soroban SDK](https://img.shields.io/badge/Soroban_SDK-21.7.7-00D1FF?style=flat-square)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-Contract-CE422B?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)

<br />

**[🔴 Live Demo Video](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec)** &nbsp;·&nbsp; **[📜 Contract on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS)** &nbsp;·&nbsp; 
<br />

</div>

---

## Overview

StellarFund is a fully on-chain freelance escrow platform built with **React 19 + TypeScript** on the Stellar blockchain using **Soroban smart contracts**. Clients lock XLM into a Rust-powered contract — funds only move when the client approves or cancels. No middlemen. No platform fees. No trust required.

```
Client creates escrow  →  Funds locked on-chain
                                  ↓
               Work delivered by a freelancer
                                  ↓
        Client releases  →  Freelancer paid instantly
             OR
         Client refunds  →  XLM returns to client

## 🥋 Stellar Journey to Mastery

<div align="center">

| Belt | Level | Status | Key Achievements |
|:----:|:------|:------:|:----------------|
| ⚪ | White Belt | ✅ Complete | Wallet connect, XLM balance, send XLM, tx confirmation |
| 🟡 | Yellow Belt | ✅ Complete | Soroban contract deployed, 3+ error types, frontend integration |
| 🟠 | Orange Belt | ✅ Complete | Production UI, CI/CD, mobile responsive, 9+ commits, advanced patterns |

</div>

### ⚪ White Belt — Wallet & Transactions
```
✅ Connect Freighter wallet (freighter-api v6 compatible)
✅ Display live XLM balance with 30-second cache
✅ Send XLM payments via Freighter signing
✅ Transaction hash display + Stellar Expert deep links
✅ Full error handling for all wallet failure modes
```

### 🟡 Yellow Belt — Smart Contract Integration
```
✅ Soroban contract deployed on Stellar Testnet
✅ 3 custom error types: EscrowNotFound, UnauthorizedClient, AlreadyCompleted
✅ Frontend calls create_escrow, release, refund, get_escrow, get_counter
✅ Transaction polling — up to 30s confirmation wait
✅ TypeScript throughout with strict types
✅ Professional component architecture
```

**Yellow Belt Contract:** `CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS`

### 🟠 Orange Belt — Production Ready
```
✅ Mobile-responsive UI — hamburger nav, clamp() typography, CSS grid auto-fit
✅ GitHub Actions CI/CD — frontend build + contract tests on every push to main
✅ 9 contract unit tests — all passing
✅ Framer Motion animations — starfield canvas, orbit intro, scroll reveals, FAQ accordion
✅ Escrow lookup — fetch any escrow by ID directly from chain via simulation
✅ Transaction history — session log with Stellar Expert links
✅ Escrow ID fallback — calls get_counter() if returnValue decode fails
✅ 9+ conventional commits covering all feature milestones
```

---

## 📸 Screenshots

### Desktop Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Mobile Responsive View
![Mobile](docs/screenshots/mobile.png)

### CI/CD Pipeline Running
![CI Pipeline](docs/screenshots/ci.png)

---

## ✨ Features

### Smart Contract (Rust + Soroban)
- Trustless escrow — XLM locked in contract state, never in a hot wallet
- `require_auth()` enforcement — only the original client wallet can release or refund
- Memo field — optional description stored on-chain with every escrow
- On-chain events emitted — `created`, `released`, `refunded`
- 9 unit tests — all success paths, all 3 error codes, independent escrow isolation

### Frontend (React 19 + TypeScript)
- Freighter v6 compatible — handles both old string and new `{ signedTxXdr }` response shapes
- Escrow ID fallback — calls `get_counter()` via simulation if `returnValue` decode fails
- Friendly contract errors — all 3 error codes mapped to plain English explanations
- Real-time escrow lookup — fetch any escrow by ID from chain
- Transaction history — Create, Release, Refund log with Stellar Expert links
- Animated landing page — starfield, orbital intro, scroll reveals, mobile hamburger menu

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Smart contract | Rust + Soroban SDK | 21.7.7 |
| Blockchain | Stellar Testnet | — |
| Wallet | Freighter API | 6.0.1 |
| Stellar SDK | @stellar/stellar-sdk | 14.6.1 |
| Frontend | React + TypeScript | 19 + 5.8 |
| Build | Vite | 6.2 |
| Styling | Tailwind CSS | 4.1 |
| Animations | Framer Motion | 11 |
| CI/CD | GitHub Actions | — |
| Hosting | Vercel | — |

</div>

---

## 📁 Project Structure

```
stellarfund/
├── .github/
│   └── workflows/
│       └── ci.yml                  ← GitHub Actions — 2 parallel jobs
│
├── contracts/
│   └── stellar_fund/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs              ← Soroban contract + 9 tests
│
├── src/
│   ├── components/
│   │   ├── StellarLogo.tsx         ← Custom SVG logo component
│   │   └── UI.tsx                  ← Button, Card, Input, Badge, Toast, LoadingOverlay, TxResult
│   ├── hooks/
│   │   ├── useWallet.ts            ← Freighter connection + balance cache
│   │   └── useToast.ts             ← Notification queue
│   ├── lib/
│   │   └── stellar.ts              ← All blockchain logic (SDK v14 + Freighter v6)
│   ├── pages/
│   │   ├── Home.tsx                ← Animated landing page
│   │   └── App.tsx                 ← Escrow dashboard
│   ├── types/
│   │   └── index.ts                ← Shared TypeScript interfaces
│   ├── main.tsx
│   └── index.css
│
├── Cargo.toml                      ← Rust workspace
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 📜 Smart Contract API

### Functions

```rust
/// Create a new escrow — returns the new escrow ID (starts at 1, increments by 1)
create_escrow(env, client: Address, freelancer: Address, amount: i128, memo: String) -> Result<u32, Error>

/// Release XLM to the freelancer — requires client auth
release(env, client: Address, id: u32) -> Result<(), Error>

/// Refund XLM back to the client — requires client auth
refund(env, client: Address, id: u32) -> Result<(), Error>

/// Read any escrow by ID — no auth required
get_escrow(env, id: u32) -> Result<Escrow, Error>

/// Returns total number of escrows ever created
get_counter(env) -> u32
```

### Error Codes

| Code | Name | When it fires |
|:----:|:-----|:-------------|
| `Error(Contract, #1)` | `EscrowNotFound` | No escrow exists with that ID |
| `Error(Contract, #2)` | `UnauthorizedClient` | Caller wallet ≠ original client wallet |
| `Error(Contract, #3)` | `AlreadyCompleted` | Escrow already Released or Refunded |

### Escrow Data Structure

```rust
pub struct Escrow {
    pub id:         u32,
    pub client:     Address,
    pub freelancer: Address,
    pub amount:     i128,          // in stroops (1 XLM = 10,000,000 stroops)
    pub status:     EscrowStatus,  // Active | Released | Refunded
    pub created_at: u64,           // ledger timestamp
    pub memo:       String,        // optional description
}
```

### CLI Invocation

```bash
# Create a 10 XLM escrow (10 XLM = 100,000,000 stroops)
stellar contract invoke \
  --id CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS \
  --source my-account --network testnet \
  -- create_escrow \
  --client GCLIENT_ADDRESS \
  --freelancer GFREELANCER_ADDRESS \
  --amount 100000000 \
  --memo "Logo design for Q2 launch"

# Release funds
stellar contract invoke ... -- release --client GCLIENT... --id 1

# Refund
stellar contract invoke ... -- refund --client GCLIENT... --id 1

# View escrow state
stellar contract invoke ... -- get_escrow --id 1
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Install |
|:-----|:--------|
| Node.js ≥ 20 | [nodejs.org](https://nodejs.org) |
| Rust stable | [rustup.rs](https://rustup.rs) |
| wasm32v1-none target | `rustup target add wasm32v1-none` |
| Stellar CLI | `cargo install --locked stellar-cli --features opt` |
| Freighter extension | [freighter.app](https://freighter.app) |

### 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/stellarfund
cd stellarfund
npm install
```

### 2 — Fund Your Testnet Wallet

Go to [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test), paste your `G…` wallet address, click **Create Account**. You receive 10,000 free testnet XLM instantly.

### 3 — (Optional) Deploy a Fresh Contract

```bash
# Generate and fund a deploy keypair
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Build WASM
cargo build -p stellar-fund-contract --target wasm32v1-none --release

# Deploy
stellar contract deploy \
  --wasm target/wasm32v1-none/release/stellar_fund_contract.wasm \
  --source-account deployer \
  --network testnet

# Set your contract ID
echo "VITE_STELLAR_CONTRACT_ID=CYOUR_CONTRACT_ID_HERE" > .env.local
```

### 4 — Run Dev Server

```bash
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

### 5 — Run Contract Tests

```bash
cargo test -p stellar-fund-contract

# Expected:
# test test_create_returns_incrementing_ids     ... ok
# test test_get_escrow_data_is_correct          ... ok
# test test_release_sets_released_status        ... ok
# test test_refund_sets_refunded_status         ... ok
# test test_double_release_is_already_completed ... ok
# test test_refund_after_release_is_already_completed ... ok
# test test_wrong_client_is_unauthorized        ... ok
# test test_get_nonexistent_is_not_found        ... ok
# test test_multiple_escrows_are_independent    ... ok
#
# test result: ok. 9 passed; 0 failed
```

---

## ⚙️ CI/CD

Every push to `main` triggers two parallel GitHub Actions jobs:

```
push to main
    │
    ├── Frontend job
    │     ├── npm ci
    │     ├── tsc --noEmit  (type check)
    │     ├── vite build
    │     └── upload dist/ artifact
    │
    └── Contract job
          ├── rustup stable + wasm32v1-none target
          ├── cargo test -p stellar-fund-contract
          ├── cargo build --target wasm32v1-none --release
          └── upload .wasm artifact
```

View the workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## 🐛 Bug Fixes & Engineering Decisions

Four non-obvious issues were encountered and resolved during development. Documented here for reference.

### Fix 1 — Escrow ID shows as "unavailable"

**Problem:** `@stellar/stellar-sdk` v14 `ScVal` return value decoding fails for some contract deployments — `scValToNative()` and `.u32()` both return `null` silently.

**Solution:** After the transaction confirms, call `get_counter()` via a simulation-only transaction. The counter value always equals the ID of the most recently created escrow. No signing required.

```typescript
let escrowId = safeU32(returnValue);          // attempt decode from returnValue
if (escrowId === null) {
  escrowId = await fetchCounter();             // fallback: read chain state directly
}
```

### Fix 2 — "Bad union switch: 4" / signing fails

**Problem:** `@stellar/freighter-api` v6 changed `signTransaction()` to return `{ signedTxXdr: string }` instead of a plain `string`. Passing the raw object to `TransactionBuilder.fromXDR()` corrupts the XDR union discriminant.

**Solution:** Detect the response shape at runtime and unwrap accordingly:

```typescript
const signedXdr =
  typeof signRaw === 'string' ? signRaw :
  (signRaw as { signedTxXdr?: string })?.signedTxXdr ?? '';
```

### Fix 3 — "XDR write error: invalid u32 value"

**Problem:** Users sometimes paste a transaction hash or wallet address into the Escrow ID field. `parseInt("a83875...")` → `NaN` → `nativeToScVal(NaN, {type:'u32'})` crashes before the RPC call.

**Solution:** `parseEscrowId()` validates and rejects non-integer inputs before any XDR is built, with specific error messages for each case.

### Fix 4 — "Error(Contract, #2) UnauthorizedClient"

**Problem:** `require_auth(client)` in Rust enforces that only the wallet that called `create_escrow` can later call `release` or `refund`. Callers from a different wallet silently fail.

**Solution:** The connected wallet address is displayed prominently during escrow creation as "CLIENT (YOU)". Error `#2` is translated to a plain-English explanation directing the user to create a fresh escrow with their current wallet.

---

## 📝 Commit History

```
feat: project scaffold — React 19, TypeScript, Tailwind v4, Vite 6
feat: Soroban contract — create_escrow, release, refund, get_escrow, get_counter
test: 9 unit tests — all error types, status transitions, independent escrow isolation
feat: stellar.ts — freighter-api v6 + stellar-sdk v14 compatibility layer
fix: escrow ID fallback via get_counter() simulation when returnValue decode fails
feat: animated landing page — starfield, orbit intro, Framer Motion, FAQ accordion
feat: app dashboard — 3-tab layout, escrow list, inline release/refund, tx history
feat: mobile responsive — hamburger nav, clamp() typography, CSS grid auto-fit
feat: GitHub Actions CI/CD — frontend build + contract tests on every push to main
```

---

## 🔗 Resources

| Resource | Link |
|:---------|:-----|
| Contract on Stellar Expert | [View →](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS) |
| Get free testnet XLM (Friendbot) | [Open →](https://laboratory.stellar.org/#account-creator?network=test) |
| Freighter Wallet | [freighter.app →](https://freighter.app) |
| Soroban Documentation | [soroban.stellar.org →](https://soroban.stellar.org/docs) |
| Stellar Developer Docs | [developers.stellar.org →](https://developers.stellar.org) |
| Stellar SDK JavaScript | [github.com/stellar/js-stellar-sdk →](https://github.com/stellar/js-stellar-sdk) |

---

<div align="center">

Built with ❤️ on Stellar &nbsp;·&nbsp; Orange Belt — Stellar Journey to Mastery 2026

[![Stellar](https://img.shields.io/badge/Stellar-Network-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)

**[⬆ Back to Top](#stellarfund)**

</div>
