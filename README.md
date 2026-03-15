<div align="center">

# ⬡ StellarFund

**Decentralized Freelance Escrow on the Stellar Blockchain**

*Get paid without the trust tax — trustless, transparent, instant.*

<br/>

[![CI](https://github.com/vaibhavi-0320/stellarfund/actions/workflows/ci.yml/badge.svg)](https://github.com/vaibhavi-0320/stellarfund/actions/workflows/ci.yml)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-7D00FF?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban_SDK-21.7.7-00D1FF?style=flat-square)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-Contract-CE422B?style=flat-square&logo=rust&logoColor=white)](https://rust-lang.org)

<br/>

[🎬 Watch Demo Video](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec) &nbsp;·&nbsp;
[🔴 Live Demo](https://steller-fund.vercel.app/) &nbsp;·&nbsp;
[📜 Contract Explorer](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS) &nbsp;·&nbsp;
[⚙️ CI/CD Pipeline](https://github.com/vaibhavi-0320/stellarfund/actions)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Level Progression](#level-progression)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Smart Contract API](#smart-contract-api)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Technical Challenges Solved](#technical-challenges-solved)
- [Commit History](#commit-history)
- [Resources](#resources)

---

## Overview

StellarFund is a fully on-chain freelance escrow platform. A client locks XLM into a Soroban smart contract — funds only move when the client approves or cancels. No company holds your money, no fees are charged, and every action is verifiable on the Stellar blockchain.

**The problem:** Freelance platforms like Upwork and Fiverr act as centralised escrow agents, charging 10–20% fees and holding full control over dispute resolution.

**The solution:** A Rust smart contract running on Stellar Testnet enforces the escrow rules. No intermediary. No fees. The code is the contract.

```
Client locks XLM
       ↓
Soroban contract holds funds on-chain
       ↓
Freelancer delivers work
       ↓
Client approves  →  Funds released to freelancer
Client cancels   →  Funds refunded to client
```

| Traditional Platforms | StellarFund |
| :-------------------- | :---------- |
| 10–20% platform fee | 0% fee |
| Centralised escrow | Smart contract escrow |
| Days to resolve disputes | Instant, on-chain enforcement |
| Trust the company | Trust the code |
| Geography restricted | Anyone with a Stellar wallet |

---

## Level Progression

| Belt | Level | Status | Summary |
| :--: | :---- | :----: | :------ |
| ⚪ | White Belt | ✅ Complete | Wallet connection, XLM balance, send transactions |
| 🟡 | Yellow Belt | ✅ Complete | Soroban contract deployed, 3 error types, frontend integration |
| 🟠 | Orange Belt | ✅ Complete | Full dApp, 9 tests, documentation, demo video, live deployment |
| 🟢 | Green Belt | ✅ Complete | CI/CD, events, inter-contract pattern, mobile responsive, 8+ commits |

<details>
<summary><strong>⚪ White Belt — Wallet &amp; Transactions</strong></summary>

<br/>

- ✅ Connect Freighter wallet (freighter-api v6 compatible)
- ✅ Display live XLM balance with 30-second cache
- ✅ Send XLM payments via Freighter signing
- ✅ Transaction hash display with Stellar Expert deep links
- ✅ Full error handling for all wallet failure modes

</details>

<details>
<summary><strong>🟡 Yellow Belt — Smart Contract Integration</strong></summary>

<br/>

- ✅ Soroban escrow contract deployed to Stellar Testnet
- ✅ Three custom error types: `EscrowNotFound`, `UnauthorizedClient`, `AlreadyCompleted`
- ✅ Frontend calls `create_escrow`, `release`, `refund`, `get_escrow`, `get_counter`
- ✅ Transaction polling with up to 30-second confirmation wait
- ✅ Professional TypeScript architecture with strict mode enabled

**Contract Address:** `CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS`

</details>

<details open>
<summary><strong>🟠 Orange Belt — Complete Mini-dApp</strong></summary>

<br/>

- ✅ Mini-dApp fully functional end-to-end
- ✅ Nine contract unit tests — all passing
- ✅ Loading states and animated progress indicators on every transaction
- ✅ Balance caching with 30-second TTL (no unnecessary RPC calls)
- ✅ Complete README documentation
- ✅ One-minute demo video recorded and published
- ✅ Live deployment on Vercel
- ✅ Minimum 3 meaningful commits (9 total)

</details>

<details>
<summary><strong>🟢 Green Belt — Production Ready</strong></summary>

<br/>

- ✅ GitHub Actions CI/CD — two parallel jobs on every push to main
- ✅ Mobile-responsive UI with hamburger navigation and fluid typography
- ✅ Smart contract events emitted on every state change
- ✅ Inter-contract call pattern documented and implemented
- ✅ Escrow ID fallback via `get_counter()` simulation
- ✅ Friendly error messages for all three contract error codes
- ✅ Nine-plus meaningful commits with conventional commit format

</details>

---

## Demo

### 🎬 Demo Video

> **Watch the full 1-minute walkthrough:** [loom.com/share/d2e7203f65a243299b0634f6e6d558ec](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec)

The demo covers:

- ✅ Connecting a Freighter wallet and viewing XLM balance
- ✅ Creating a new escrow with freelancer address and amount
- ✅ Viewing the transaction on Stellar Expert
- ✅ Looking up an escrow by ID from the blockchain
- ✅ Releasing funds to the freelancer with Freighter signature
- ✅ Demonstrating the refund flow

### 🔴 Live Application

> **Deployed on Vercel:** [stellarfund.vercel.app](https://steller-fund.vercel.app/)

---

## Screenshots

### Desktop Dashboard

![Desktop Dashboard](docs/screenshots/dashboard.png)

### Mobile Responsive View

![Mobile View](docs/screenshots/mobile.png)

### Test Output — 9 Tests Passing

![Test Output](docs/screenshots/tests.png)

### CI/CD Pipeline

![CI/CD Pipeline](docs/screenshots/ci.png)

---

## Features

| Feature | Description | Status |
| :------ | :---------- | :----: |
| Trustless escrow | XLM locked in Soroban contract, never in a hot wallet | ✅ |
| Freighter wallet | Connect, sign, and broadcast transactions | ✅ |
| Create escrow | Lock XLM for a specific freelancer with memo | ✅ |
| Release funds | Pay freelancer when work is approved | ✅ |
| Refund | Recover XLM if work is not delivered | ✅ |
| Escrow lookup | Fetch any escrow by ID directly from chain | ✅ |
| Loading states | Animated 5-step progress overlay per transaction | ✅ |
| Balance cache | 30-second TTL cache on wallet balance | ✅ |
| Contract events | On-chain events for created, released, refunded | ✅ |
| Mobile responsive | Hamburger nav, fluid typography, CSS grid | ✅ |
| CI/CD pipeline | GitHub Actions builds and tests on every push | ✅ |
| 9 unit tests | All contract functions and edge cases covered | ✅ |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              User's Browser                 │
│                                             │
│   React 19 + TypeScript + Tailwind CSS      │
│   Framer Motion + Vite 6                    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│           Freighter Extension               │
│   Signs transactions locally                │
│   Private key never leaves device           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        @stellar/stellar-sdk v14             │
│   Builds + simulates + submits transactions │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        Soroban RPC Testnet                  │
│   soroban-testnet.stellar.org               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        Soroban Smart Contract               │
│   Rust · Soroban SDK 21.7.7                 │
│   Contract: CCKR26GKAMQQOQ...URNJAS         │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│           Stellar Testnet                   │
│   Public ledger · Immutable · Auditable     │
└─────────────────────────────────────────────┘
```

| Layer | Technology | Role |
| :---- | :--------- | :--- |
| Frontend | React 19 + TypeScript | User interface and state management |
| Wallet | Freighter v6 | Transaction signing — keys stay on device |
| SDK | stellar-sdk v14 | Build, simulate, and submit transactions |
| RPC | Soroban Testnet RPC | Communicate with the Stellar network |
| Contract | Rust + Soroban SDK 21 | Enforce escrow rules on-chain |
| Network | Stellar Testnet | Public ledger and settlement layer |

---

## Project Structure

```text
stellarfund/
│
├── .github/
│   └── workflows/
│       └── ci.yml                 GitHub Actions — 2 parallel jobs
│
├── contracts/
│   └── stellar_fund/
│       ├── Cargo.toml             Contract package definition
│       └── src/
│           └── lib.rs             Soroban contract + 9 unit tests
│
├── src/
│   ├── components/
│   │   ├── StellarLogo.tsx        Custom SVG brand logo
│   │   └── UI.tsx                 Button, Card, Input, Badge, Toast, LoadingOverlay
│   │
│   ├── hooks/
│   │   ├── useWallet.ts           Freighter connection state + balance cache
│   │   └── useToast.ts            Notification queue management
│   │
│   ├── lib/
│   │   └── stellar.ts             All blockchain logic (SDK v14 + Freighter v6)
│   │
│   ├── pages/
│   │   ├── Home.tsx               Animated landing page
│   │   └── App.tsx                Escrow dashboard — create, list, release, refund
│   │
│   ├── types/
│   │   └── index.ts               Shared TypeScript interfaces
│   │
│   ├── main.tsx                   React app entry point
│   └── index.css                  Tailwind v4 + keyframe animations
│
├── docs/
│   └── screenshots/               README screenshots stored here
│
├── Cargo.toml                     Rust workspace root
├── package.json                   Node dependencies and scripts
├── vite.config.ts                 Vite build configuration
├── tsconfig.json                  TypeScript strict mode config
├── vercel.json                    Vercel SPA routing rules
├── .env.example                   Environment variable template
└── README.md                      This file
```

---

## Smart Contract API

### Functions

| Function | Parameters | Returns | Auth Required |
| :------- | :--------- | :------ | :-----------: |
| `create_escrow` | `client, freelancer, amount: i128, memo: String` | `Result<u32, Error>` | client |
| `release` | `client, id: u32` | `Result<(), Error>` | client |
| `refund` | `client, id: u32` | `Result<(), Error>` | client |
| `get_escrow` | `id: u32` | `Result<Escrow, Error>` | none |
| `get_counter` | — | `u32` | none |

### Error Codes

| Code | Name | When It Fires |
| :--: | :--- | :------------ |
| `#1` | `EscrowNotFound` | No escrow exists with the given ID |
| `#2` | `UnauthorizedClient` | The caller wallet is not the original client |
| `#3` | `AlreadyCompleted` | Escrow has already been released or refunded |

### Escrow Data Structure

```rust
pub struct Escrow {
    pub id:         u32,
    pub client:     Address,
    pub freelancer: Address,
    pub amount:     i128,          // stroops — 1 XLM = 10,000,000 stroops
    pub status:     EscrowStatus,  // Active | Released | Refunded
    pub created_at: u64,           // Stellar ledger timestamp
    pub memo:       String,        // Optional description stored on-chain
}
```

### Contract Events

Every state change emits an on-chain event that can be queried from Stellar Expert or via the RPC.

| Event | Emitted When | Payload |
| :---- | :----------- | :------ |
| `created` | `create_escrow` succeeds | `(id, amount)` |
| `released` | `release` succeeds | `(id, amount)` |
| `refunded` | `refund` succeeds | `(id, amount)` |

### CLI Invocation

```bash
# Create a 10 XLM escrow (10 XLM = 100,000,000 stroops)
stellar contract invoke \
  --id CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS \
  --source my-account \
  --network testnet \
  -- create_escrow \
  --client GCLIENT_ADDRESS_HERE \
  --freelancer GFREELANCER_ADDRESS_HERE \
  --amount 100000000 \
  --memo "Website redesign project"

# Release funds to freelancer
stellar contract invoke \
  --id CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS \
  --source my-account \
  --network testnet \
  -- release \
  --client GCLIENT_ADDRESS_HERE \
  --id 1

# Refund to client
stellar contract invoke \
  --id CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS \
  --source my-account \
  --network testnet \
  -- refund \
  --client GCLIENT_ADDRESS_HERE \
  --id 1

# Read escrow state
stellar contract invoke \
  --id CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS \
  --source my-account \
  --network testnet \
  -- get_escrow \
  --id 1
```

---

## Testing

Run all contract tests:

```bash
cargo test -p stellar-fund-contract
```

Expected output:

```text
running 9 tests
test tests::test_create_returns_incrementing_ids           ... ok
test tests::test_get_escrow_data_is_correct                ... ok
test tests::test_release_sets_released_status              ... ok
test tests::test_refund_sets_refunded_status               ... ok
test tests::test_double_release_is_already_completed       ... ok
test tests::test_refund_after_release_is_already_completed ... ok
test tests::test_wrong_client_is_unauthorized              ... ok
test tests::test_get_nonexistent_is_not_found              ... ok
test tests::test_multiple_escrows_are_independent          ... ok

test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured
```

### Test Coverage

| Test Name | What It Verifies |
| :-------- | :--------------- |
| `test_create_returns_incrementing_ids` | Counter starts at 1 and increments correctly |
| `test_get_escrow_data_is_correct` | All fields stored and retrieved accurately |
| `test_release_sets_released_status` | Status changes to `Released` after release call |
| `test_refund_sets_refunded_status` | Status changes to `Refunded` after refund call |
| `test_double_release_is_already_completed` | Error `#3` returned on second release attempt |
| `test_refund_after_release_is_already_completed` | Error `#3` returned on refund after release |
| `test_wrong_client_is_unauthorized` | Error `#2` returned when wrong wallet calls |
| `test_get_nonexistent_is_not_found` | Error `#1` returned for non-existent escrow ID |
| `test_multiple_escrows_are_independent` | Completing one escrow does not affect others |

---

## CI/CD Pipeline

Every push to `main` automatically runs two parallel jobs:

```text
Push to main
    │
    ├── job: frontend
    │     ├── actions/setup-node@v4 (Node 20)
    │     ├── npm ci
    │     ├── tsc --noEmit        (TypeScript type check)
    │     ├── vite build          (production build)
    │     └── upload dist/ as artifact
    │
    └── job: contract
          ├── dtolnay/rust-toolchain (stable + wasm32v1-none)
          ├── actions/cache (Cargo registry)
          ├── cargo test -p stellar-fund-contract
          ├── cargo build --target wasm32v1-none --release
          └── upload .wasm as artifact
```

The workflow file lives at [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Both jobs must pass before a pull request can be merged. The CI badge at the top of this README reflects the current status of the `main` branch.

---

## Quick Start

### Prerequisites

| Tool | Version | Install |
| :--- | :------ | :------ |
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| Rust | stable | [rustup.rs](https://rustup.rs) |
| wasm32v1-none target | — | `rustup target add wasm32v1-none` |
| Stellar CLI | latest | `cargo install --locked stellar-cli --features opt` |
| Freighter browser extension | latest | [freighter.app](https://freighter.app) |

### Step 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/stellarfund
cd stellarfund
npm install
```

### Step 2 — Get free testnet XLM

Open [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test), paste your `G...` wallet address, and click **Create Account**. You receive 10,000 free testnet XLM instantly.

### Step 3 — Configure environment

```bash
cp .env.example .env.local
# VITE_STELLAR_CONTRACT_ID is already set to the deployed contract
# Change it if you deploy your own
```

### Step 4 — Run the dev server

```bash
npm run dev
# Application opens at http://localhost:3000
```

### Step 5 — Run contract tests

```bash
cargo test -p stellar-fund-contract
# Expected: 9 passed, 0 failed
```

---

## Deployment

### Deploy the smart contract to Stellar Testnet

```bash
# Step 1 — Generate and fund a deployer keypair
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Step 2 — Build the WASM binary
cargo build -p stellar-fund-contract --target wasm32v1-none --release

# Step 3 — Deploy to Stellar Testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/stellar_fund_contract.wasm \
  --source-account deployer \
  --network testnet

# Step 4 — Copy the returned C... address
# Add it to .env.local as VITE_STELLAR_CONTRACT_ID
```

### Deploy the frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod

# During deployment, add this environment variable:
# VITE_STELLAR_CONTRACT_ID = your_contract_address_here
```

The `vercel.json` file in the repository already includes the SPA rewrite rule so page refreshes work correctly.

---

## Technical Challenges Solved

Four non-obvious bugs were encountered and fixed during development.

### 1 — Escrow ID showed as "unavailable" after creation

**Problem:** `@stellar/stellar-sdk` v14 `ScVal` return value decoding fails silently for some contract deployments. Both `scValToNative()` and `.u32()` return `null` without throwing.

**Fix:** After the transaction confirms on-chain, call `get_counter()` via a simulation-only transaction. The counter value always equals the ID of the most recently created escrow, and simulation requires no signing.

```typescript
let escrowId = safeU32(returnValue);
if (escrowId === null) {
  escrowId = await fetchCounter(); // read chain state as fallback
}
```

### 2 — Freighter signing returned an object instead of a string

**Problem:** `@stellar/freighter-api` v6 changed `signTransaction()` to return `{ signedTxXdr: string }` instead of a plain string. Passing the raw object into `TransactionBuilder.fromXDR()` corrupted the XDR union discriminant, producing the error "Bad union switch: 4".

**Fix:**

```typescript
const signedXdr =
  typeof signRaw === 'string'
    ? signRaw
    : (signRaw as { signedTxXdr?: string })?.signedTxXdr ?? '';
```

### 3 — XDR crash when user pasted a transaction hash as escrow ID

**Problem:** `parseInt("a83875...")` returns `NaN`. Passing `NaN` into `nativeToScVal(NaN, { type: 'u32' })` throws during XDR serialisation, crashing before the RPC call.

**Fix:** `parseEscrowId()` validates the input and returns a specific error message for wallet addresses, transaction hashes, and non-integer values — all before any XDR is built.

### 4 — "Error(Contract, #2) UnauthorizedClient" on release or refund

**Problem:** `require_auth(client)` in Rust correctly enforces that only the wallet that called `create_escrow` can later call `release` or `refund`. The frontend showed a raw contract error string that confused users.

**Fix:** Error code `#2` is now caught and translated to plain English. The connected wallet address is also displayed as **CLIENT (YOU)** during escrow creation so users understand the constraint before they create the escrow.

---

## Commit History

```text
feat: project scaffold — React 19, TypeScript, Tailwind v4, Vite 6
feat: Soroban contract — create_escrow, release, refund, get_escrow, get_counter
test: 9 unit tests — all error types, status transitions, edge cases
feat: stellar.ts — freighter-api v6 + stellar-sdk v14 compatibility layer
fix: escrow ID fallback via get_counter() when returnValue decode fails
feat: animated landing page — starfield, orbit intro, Framer Motion, FAQ accordion
feat: app dashboard — 3-tab layout, escrow list, inline release and refund, tx history
feat: mobile responsive — hamburger nav, clamp() typography, CSS grid auto-fit
feat: GitHub Actions CI/CD — frontend build and contract tests on every push to main
```

---

## Resources

| Resource | Link |
| :------- | :--- |
| Live Demo | [stellarfund.vercel.app](https://stellarfund.vercel.app) |
| Demo Video | [loom.com/share/d2e7203f...](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec) |
| Contract on Stellar Expert | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCKR26GKAMQQOQAXYU6SLDAYFQ4V73NSDTXSD2BCQXP6EEMAA7URNJAS) |
| Free Testnet XLM | [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test) |
| Freighter Wallet | [freighter.app](https://freighter.app) |
| Soroban Documentation | [soroban.stellar.org](https://soroban.stellar.org/docs) |
| Stellar Developer Docs | [developers.stellar.org](https://developers.stellar.org) |
| Stellar SDK JavaScript | [github.com/stellar/js-stellar-sdk](https://github.com/stellar/js-stellar-sdk) |

---

<div align="center">

Built with ❤️ on Stellar &nbsp;·&nbsp; Stellar Journey to Mastery 2026

[![Stellar](https://img.shields.io/badge/Stellar-Network-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)

[⬆ Back to Top](#stellarfund)

</div>
