<div align="center">

<br/>

# ⬡ StellarFund

**Trustless Freelance Escrow on the Stellar Blockchain**

*Get paid without the trust tax.*

<br/>

[![CI](https://github.com/YOUR_USERNAME/stellarfund/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/stellarfund/actions/workflows/ci.yml)
[![Stellar Testnet](https://img.shields.io/badge/Network-Stellar_Testnet-7D00FF?style=flat-square&logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet)
[![Soroban SDK](https://img.shields.io/badge/Soroban_SDK-21.7.7-00D1FF?style=flat-square)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-Contract-CE422B?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org)

<br/>

[🎬 Demo Video](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec) &nbsp;·&nbsp; [📜 Contract on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS) &nbsp;·&nbsp; [⚙️ CI/CD Pipeline](https://github.com/YOUR_USERNAME/stellarfund/actions)

<br/>

</div>

---

## What is StellarFund?

StellarFund is a fully on-chain freelance escrow platform built with **React 19 + TypeScript** on the Stellar blockchain using **Soroban smart contracts**. A client locks XLM into a Rust-powered contract — funds only move when the client approves or cancels. No middlemen, no platform fees, no trust required.

```
Client creates escrow  →  XLM locked in smart contract
                                      ↓
                   Freelancer delivers the work
                                      ↓
        Client approves  →  Funds released to freelancer
              OR
         Client cancels  →  XLM refunded to client
```

| Traditional Platforms | StellarFund |
|-----------------------|-------------|
| 5–20% platform fee | **0% — no fee** |
| Disputes take days | Contract enforces the rules |
| Centralised database | On-chain, auditable forever |
| Blocked by geography | Anyone with a Stellar wallet |
| Trust the company | Trust the math |

---

## 🥋 Stellar Journey to Mastery

| Belt | Level | Status | Completed |
|:----:|:------|:------:|:----------|
| ⚪ | White Belt | ✅ | Wallet connect, XLM balance, send XLM, tx confirmation |
| 🟡 | Yellow Belt | ✅ | Soroban contract deployed, 3+ error types, frontend integration |
| 🟠 | Orange Belt | ✅ | Full dApp, tests, documentation, demo video, CI/CD, mobile responsive |

<details>
<summary><b>⚪ White Belt — Wallet & Transactions</b></summary>

<br/>

- ✅ Connect Freighter wallet (freighter-api v6 compatible)
- ✅ Display live XLM balance with 30-second cache
- ✅ Send XLM payments via Freighter signing
- ✅ Transaction hash display + Stellar Expert deep links
- ✅ Full error handling for all wallet failure modes

</details>

<details>
<summary><b>🟡 Yellow Belt — Smart Contract Integration</b></summary>

<br/>

- ✅ Soroban contract deployed on Stellar Testnet
- ✅ 3 custom error types: `EscrowNotFound`, `UnauthorizedClient`, `AlreadyCompleted`
- ✅ Frontend calls `create_escrow`, `release`, `refund`, `get_escrow`, `get_counter`
- ✅ Transaction polling — up to 30 second confirmation wait
- ✅ TypeScript throughout with strict types
- ✅ Professional component architecture

**Contract:** `CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS`

</details>

<details open>
<summary><b>🟠 Orange Belt — Complete dApp with Documentation</b></summary>

<br/>

- ✅ Mini-dApp fully functional end-to-end
- ✅ **9 contract tests passing** (see test output below)
- ✅ README complete with all required sections
- ✅ **Demo video recorded** (1 minute, full functionality walkthrough)
- ✅ Loading states and progress indicators on every transaction
- ✅ Balance caching (30-second TTL, no unnecessary RPC calls)
- ✅ Mobile-responsive UI — hamburger nav, `clamp()` typography, CSS grid `auto-fit`
- ✅ GitHub Actions CI/CD — frontend build + contract tests on every push
- ✅ Framer Motion animations — starfield, orbit intro, scroll reveals, FAQ accordion
- ✅ Escrow ID fallback — calls `get_counter()` if `returnValue` decode fails
- ✅ 9+ meaningful commits with conventional commit messages

</details>

---

## 🎬 Demo Video

> **Watch the 1-minute demo:** [loom.com/share/d2e7203f65a243299b0634f6e6d558ec](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec)

The demo covers:
1. Connecting Freighter wallet and checking XLM balance
2. Creating a new escrow with a freelancer address and amount
3. Viewing the transaction on Stellar Expert
4. Looking up the escrow by ID from the chain
5. Releasing funds (or refunding) with Freighter signature

---

## 📸 Screenshots

### Desktop Dashboard
![Desktop Dashboard](docs/screenshots/dashboard.png)

### Mobile Responsive View
![Mobile View](docs/screenshots/mobile.png)

### Test Output — 9 Tests Passing

```
running 9 tests
test tests::test_create_returns_incrementing_ids          ... ok
test tests::test_get_escrow_data_is_correct               ... ok
test tests::test_release_sets_released_status             ... ok
test tests::test_refund_sets_refunded_status              ... ok
test tests::test_double_release_is_already_completed      ... ok
test tests::test_refund_after_release_is_already_completed ... ok
test tests::test_wrong_client_is_unauthorized             ... ok
test tests::test_get_nonexistent_is_not_found             ... ok
test tests::test_multiple_escrows_are_independent         ... ok

test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured
```

### CI/CD Pipeline
![CI Pipeline](docs/screenshots/ci.png)

---

## ✨ Features

### Smart Contract (Rust + Soroban)

- **Trustless escrow** — XLM locked in contract state, never in a hot wallet
- **`require_auth()` enforcement** — only the original client wallet can release or refund
- **Memo field** — optional description stored on-chain with every escrow
- **On-chain events** — `created`, `released`, `refunded` events emitted on state change
- **9 unit tests** — all success paths, all 3 error codes, independent escrow isolation

### Frontend (React 19 + TypeScript)

- **Loading states** — animated 5-step progress overlay on every transaction
- **Balance caching** — 30-second TTL cache avoids hammering the RPC
- **Freighter v6 compatible** — handles both `string` and `{ signedTxXdr }` response shapes
- **Escrow ID fallback** — calls `get_counter()` via simulation if `returnValue` decode fails
- **Friendly error messages** — all 3 contract error codes translated to plain English
- **Escrow lookup** — fetch any escrow by ID from the blockchain in real time
- **Transaction history** — session log of all actions with Stellar Expert links
- **Animated UI** — starfield canvas, orbital intro splash, Framer Motion scroll reveals
- **Mobile responsive** — hamburger nav, `clamp()` typography, CSS grid `auto-fit`

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Smart contract | Rust + Soroban SDK | 21.7.7 |
| Blockchain | Stellar Testnet | — |
| Wallet | Freighter API | 6.0.1 |
| Stellar SDK | @stellar/stellar-sdk | 14.6.1 |
| Frontend | React + TypeScript | 19 + 5.8 |
| Build tool | Vite | 6.2 |
| Styling | Tailwind CSS | 4.1 |
| Animations | Framer Motion | 11 |
| CI/CD | GitHub Actions | — |
| Hosting | Vercel | — |

---

## 📁 Project Structure

```
stellarfund/
│
├── .github/
│   └── workflows/
│       └── ci.yml                ← GitHub Actions (2 parallel jobs)
│
├── contracts/
│   └── stellar_fund/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs            ← Soroban contract + 9 tests
│
├── src/
│   ├── components/
│   │   ├── StellarLogo.tsx       ← Custom SVG logo
│   │   └── UI.tsx                ← Button, Card, Input, Badge, Toast, LoadingOverlay
│   │
│   ├── hooks/
│   │   ├── useWallet.ts          ← Freighter connection + balance cache
│   │   └── useToast.ts           ← Notification queue
│   │
│   ├── lib/
│   │   └── stellar.ts            ← All blockchain logic (SDK v14 + Freighter v6)
│   │
│   ├── pages/
│   │   ├── Home.tsx              ← Animated landing page
│   │   └── App.tsx               ← Escrow dashboard
│   │
│   ├── types/
│   │   └── index.ts              ← Shared TypeScript interfaces
│   │
│   ├── main.tsx
│   └── index.css
│
├── Cargo.toml                    ← Rust workspace
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 📜 Smart Contract API

### Functions

| Function | Parameters | Returns | Auth |
|:---------|:-----------|:--------|:-----|
| `create_escrow` | `client, freelancer, amount: i128, memo: String` | `Result<u32, Error>` | client |
| `release` | `client, id: u32` | `Result<(), Error>` | client |
| `refund` | `client, id: u32` | `Result<(), Error>` | client |
| `get_escrow` | `id: u32` | `Result<Escrow, Error>` | none |
| `get_counter` | — | `u32` | none |

### Error Codes

| Code | Name | Meaning |
|:----:|:-----|:--------|
| `#1` | `EscrowNotFound` | No escrow with that ID exists |
| `#2` | `UnauthorizedClient` | Caller wallet ≠ original client wallet |
| `#3` | `AlreadyCompleted` | Escrow already Released or Refunded |

### Escrow Struct

```rust
pub struct Escrow {
    pub id:         u32,
    pub client:     Address,
    pub freelancer: Address,
    pub amount:     i128,          // stroops (1 XLM = 10,000,000 stroops)
    pub status:     EscrowStatus,  // Active | Released | Refunded
    pub created_at: u64,           // ledger timestamp
    pub memo:       String,
}
```

### CLI Usage

```bash
# Create a 10 XLM escrow
stellar contract invoke \
  --id CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS \
  --source my-account \
  --network testnet \
  -- create_escrow \
  --client GCLIENT_ADDRESS \
  --freelancer GFREELANCER_ADDRESS \
  --amount 100000000 \
  --memo "Logo design for Q2 launch"

# Release funds to freelancer
stellar contract invoke \
  --id CONTRACT_ID --source my-account --network testnet \
  -- release --client GCLIENT... --id 1

# Refund to client
stellar contract invoke \
  --id CONTRACT_ID --source my-account --network testnet \
  -- refund --client GCLIENT... --id 1

# Read escrow state
stellar contract invoke \
  --id CONTRACT_ID --source my-account --network testnet \
  -- get_escrow --id 1
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Install |
|:-----|:--------|:--------|
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| Rust | stable | [rustup.rs](https://rustup.rs) |
| wasm32v1-none target | — | `rustup target add wasm32v1-none` |
| Stellar CLI | latest | `cargo install --locked stellar-cli --features opt` |
| Freighter | latest | [freighter.app](https://freighter.app) |

### 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/stellarfund
cd stellarfund
npm install
```

### 2 — Get free testnet XLM

Visit [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test), paste your `G…` wallet address, click **Create Account**. You receive 10,000 free testnet XLM instantly.

### 3 — Configure environment

```bash
cp .env.example .env.local
# Edit .env.local and set VITE_STELLAR_CONTRACT_ID if deploying your own contract
```

### 4 — Run the dev server

```bash
npm run dev
# Open http://localhost:3000
```

### 5 — (Optional) Deploy your own contract

```bash
# Fund a deploy keypair
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Build WASM
cargo build -p stellar-fund-contract --target wasm32v1-none --release

# Deploy
stellar contract deploy \
  --wasm target/wasm32v1-none/release/stellar_fund_contract.wasm \
  --source-account deployer \
  --network testnet
# → Copy the C… address into .env.local as VITE_STELLAR_CONTRACT_ID
```

---

## 🧪 Tests

Run contract tests:

```bash
cargo test -p stellar-fund-contract
```

Expected output:

```
running 9 tests
test tests::test_create_returns_incrementing_ids          ... ok
test tests::test_get_escrow_data_is_correct               ... ok
test tests::test_release_sets_released_status             ... ok
test tests::test_refund_sets_refunded_status              ... ok
test tests::test_double_release_is_already_completed      ... ok
test tests::test_refund_after_release_is_already_completed ... ok
test tests::test_wrong_client_is_unauthorized             ... ok
test tests::test_get_nonexistent_is_not_found             ... ok
test tests::test_multiple_escrows_are_independent         ... ok

test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured
```

### What each test covers

| Test | Covers |
|:-----|:-------|
| `test_create_returns_incrementing_ids` | Counter increments correctly, IDs start at 1 |
| `test_get_escrow_data_is_correct` | All fields stored and returned accurately |
| `test_release_sets_released_status` | Status changes to `Released` after release |
| `test_refund_sets_refunded_status` | Status changes to `Refunded` after refund |
| `test_double_release_is_already_completed` | Error `#3` on second release attempt |
| `test_refund_after_release_is_already_completed` | Error `#3` on refund after release |
| `test_wrong_client_is_unauthorized` | Error `#2` when wrong wallet calls release/refund |
| `test_get_nonexistent_is_not_found` | Error `#1` for non-existent escrow ID |
| `test_multiple_escrows_are_independent` | Closing one escrow does not affect others |

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers two parallel GitHub Actions jobs:

```
push to main
    │
    ├── Frontend job
    │     ├── npm ci
    │     ├── tsc --noEmit   (TypeScript type check)
    │     ├── vite build
    │     └── upload dist/ artifact
    │
    └── Contract job
          ├── Rust stable + wasm32v1-none target
          ├── cargo test -p stellar-fund-contract
          ├── cargo build --target wasm32v1-none --release
          └── upload .wasm artifact
```

View the workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## 🐛 Technical Challenges Solved

Four non-obvious issues encountered and fixed during development.

### 1 — Escrow ID showed as "unavailable"

**Problem:** `@stellar/stellar-sdk` v14 `ScVal` return value decoding fails silently for some contract deployments — both `scValToNative()` and `.u32()` return `null`.

**Fix:** After the transaction confirms, call `get_counter()` via a simulation-only transaction. The counter equals the ID of the most recently created escrow. No signing required.

```typescript
let escrowId = safeU32(returnValue);
if (escrowId === null) {
  escrowId = await fetchCounter(); // read chain state directly
}
```

### 2 — Freighter signing returned an object, not a string

**Problem:** `@stellar/freighter-api` v6 changed `signTransaction()` to return `{ signedTxXdr: string }` instead of a plain string. Passing the object to `TransactionBuilder.fromXDR()` corrupted the XDR union discriminant with error "Bad union switch: 4".

**Fix:**

```typescript
const signedXdr =
  typeof signRaw === 'string' ? signRaw :
  (signRaw as { signedTxXdr?: string })?.signedTxXdr ?? '';
```

### 3 — XDR crash when user pastes a transaction hash as escrow ID

**Problem:** `parseInt("a83875...")` returns `NaN`. `nativeToScVal(NaN, { type: 'u32' })` throws during XDR serialisation before the RPC call is made.

**Fix:** `parseEscrowId()` validates and rejects wallet addresses, tx hashes, and non-integers before any XDR is built, with a specific error message for each case.

### 4 — "Error(Contract, #2) UnauthorizedClient" on release/refund

**Problem:** `require_auth(client)` in Rust enforces that only the wallet that called `create_escrow` can later call `release` or `refund`. This is correct behaviour, but the error message was confusing.

**Fix:** Error `#2` is now translated to plain English: *"Your wallet is not the client who created this escrow. Create a new escrow with your current wallet first."* The connected wallet is also shown prominently as **CLIENT (YOU)** during creation.

---

## 📝 Commit History

```
feat: project scaffold — React 19, TypeScript, Tailwind v4, Vite 6
feat: Soroban contract — create_escrow, release, refund, get_escrow, get_counter
test: 9 unit tests covering all functions, error types, and edge cases
feat: stellar.ts — freighter-api v6 + stellar-sdk v14 compatibility layer
fix: escrow ID fallback via get_counter() when returnValue decode fails
feat: animated landing page — starfield, orbit intro, Framer Motion, FAQ accordion
feat: app dashboard — 3-tab layout, escrow list, inline release/refund, tx history
feat: mobile responsive — hamburger nav, clamp() typography, CSS grid auto-fit
feat: GitHub Actions CI/CD — frontend build + contract tests on every push to main
```

---

## 🔗 Resources

| Resource | Link |
|:---------|:-----|
| Live Demo Video | [loom.com →](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec) |
| Contract on Stellar Expert | [View →](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS) |
| Get free testnet XLM | [Friendbot →](https://laboratory.stellar.org/#account-creator?network=test) |
| Freighter Wallet | [freighter.app →](https://freighter.app) |
| Soroban Docs | [soroban.stellar.org →](https://soroban.stellar.org/docs) |
| Stellar Developer Docs | [developers.stellar.org →](https://developers.stellar.org) |

---

<div align="center">

Built with ❤️ on Stellar &nbsp;·&nbsp; Orange Belt &nbsp;·&nbsp; Stellar Journey to Mastery 2026

[![Stellar](https://img.shields.io/badge/Stellar-Network-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)

[⬆ Back to Top](#stellarfund)

</div>
