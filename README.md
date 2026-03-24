<div align="center">

<br/>

<img src="assets/SS_1_Home_page.png" alt="StellarFund — Get paid without the trust tax" width="100%"/>

<br/><br/>

# The escrow is the code. The code is the law.

*StellarFund locks XLM in a Soroban smart contract on the Stellar blockchain.*
*Funds are released only when work is approved. No company in the middle. No fees. No trust required.*

<br/>

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-7D00FF?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban_SDK-21.7.7-00D1FF?style=flat-square)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-Contract-CE422B?style=flat-square&logo=rust&logoColor=white)](https://rust-lang.org)
[![Tests](https://img.shields.io/badge/Tests-9%20Passing-4ADE80?style=flat-square)](#testing)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](LICENSE)

<br/>

[🎬 **Watch Demo**](https://www.loom.com/share/15ca447c73c246ccafb7e6cb7cf675a9) &nbsp;&nbsp;|&nbsp;&nbsp;
[🔴 **Live App**](https://steller-fund.vercel.app/) &nbsp;&nbsp;|&nbsp;&nbsp;
[📜 **Contract on Stellar Expert**](https://stellar.expert/explorer/testnet/contract/CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7) &nbsp;&nbsp;|&nbsp;&nbsp;
[⚙️ **CI/CD**](https://github.com/vaibhavi-0320/stellarfund/.github/workflows/main.yml)

<br/>

</div>

---

<div align="center">

## What makes StellarFund different?

</div>

> Most freelance platforms hold your money in a company bank account, charge 10–20% fees, and act as judge if there is a dispute. You have no choice but to trust them.
>
> StellarFund replaces the company with a **44-line Rust smart contract** deployed to the Stellar blockchain. The rules are public. The enforcement is automatic. Nobody can override it — not even the developer who wrote it.

```
You lock XLM  →  Code holds it  →  You approve  →  Freelancer gets paid instantly
                                 →  You cancel  →  You get it back instantly
```

---

## 🥋 Stellar Journey to Mastery

<div align="center">

| | Belt | Status | What was built |
|:-:|:--|:-:|:--|
| ⚪ | White Belt | ✅ | Freighter wallet connection, live XLM balance, send transactions |
| 🟡 | Yellow Belt | ✅ | Soroban contract deployed, 3 error types, frontend calls contract |
| 🟠 | Orange Belt | ✅ | Full dApp, 9 tests passing, demo video, live on Vercel |
| 🟢 | Green Belt | ✅ | CI/CD pipeline, contract events, mobile responsive, 9+ commits |

</div>

<details>
<summary><strong>⚪ White Belt — Wallet &amp; Transactions</strong></summary>

<br/>

- ✅ Connect Freighter wallet — freighter-api v6 compatible, handles both response shapes
- ✅ Live XLM balance display with 30-second cache to avoid hammering the RPC
- ✅ Send XLM transactions signed locally — private key never leaves the device
- ✅ Every transaction shows a hash with a direct link to Stellar Expert
- ✅ Full error handling — Freighter not installed, wallet locked, signing cancelled

</details>

<details>
<summary><strong>🟡 Yellow Belt — Smart Contract</strong></summary>

<br/>

- ✅ Soroban escrow contract written in Rust, deployed to Stellar Testnet
- ✅ Three custom error codes: `EscrowNotFound` `UnauthorizedClient` `AlreadyCompleted.`
- ✅ Frontend calls all five contract functions with proper XDR serialisation
- ✅ Transaction polling waits up to 30 seconds for on-chain confirmation
- ✅ TypeScript strict mode throughout — zero `any` types

**Contract:** `CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7`

</details>

<details open>
<summary><strong>🟠 Orange Belt — Complete dApp</strong></summary>

<br/>

- ✅ End-to-end escrow flow: create → view → release or refund
- ✅ **9 contract unit tests — all passing**
- ✅ Animated 5-step loading overlay on every transaction
- ✅ Balance caching — 30-second TTL, no unnecessary RPC calls
- ✅ Demo video — full 1-minute walkthrough recorded and published
- ✅ Live deployment on Vercel
- ✅ Complete documentation in this README

</details>

<details>
<summary><strong>🟢 Green Belt — Production Ready</strong></summary>

<br/>

- ✅ GitHub Actions CI/CD — frontend build and contract tests run in parallel on every push
- ✅ Mobile-responsive layout — hamburger nav, fluid typography, CSS grid auto-fit
- ✅ On-chain events emitted on every state change — queryable from Stellar Expert
- ✅ Escrow ID fallback — calls `get_counter()` via simulation if return value decode fails
- ✅ All three contract error codes caught and translated to plain English
- ✅ 9 conventional commits covering every milestone

</details>

---

## 🎬 Demo Video

<div align="center">

**[▶ Watch the 4-minute full (Longer Version) walkthrough on Loom](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec)**

</div>

The demo shows every part of the working application:

- ✅ Animated landing page loading on Stellar Testnet
- ✅ Freighter wallet connecting and displaying live XLM balance
- ✅ Creating Escrow #9 — 200 XLM locked for a Marketing project
- ✅ Transaction appearing on Stellar Expert within seconds
- ✅ Active escrow card with Release Funds and Refund buttons
- ✅ Full release and refund flows with Freighter signature prompt

---

## 📸 App Screenshots

### Landing Page

<img src="Screenshots/SS 1 Home page.png" alt="StellarFund Home Page" width="100%"/>

> *Animated starfield, orbital rings, and the tagline that says it all — "Get paid without the trust tax."*

---

### How It Works — 3 Simple Steps

<img src="Screenshots/SS 2 How it works- 3 simple steps.png" alt="How StellarFund Works" width="100%"/>

> *Three cards explain the entire product: lock funds, deliver work, one-click settlement.*

---

### Wallet Connected — Create Escrow

<img src="Screenshots/SS 3 Wallet connection.png" width="100%"/>

> *Wallet balance shows 19,100.92 XLM. Create Escrow form with freelancer address, amount, and memo field.*

---

### Smart Contract Live on Stellar Expert

<img src="Screenshots/SS 4 Smart Contract on Stellar Expert.png" alt="Contract on Stellar Expert with 300 XLM locked" width="100%"/>

> *Contract `CBB3...JPT7` live on Stellar Testnet. 300 XLM locked in contract state. 11 storage entries.*

---

### Escrow #9 Created — Active with Release and Refund

<img src="Screenshots/SS 5 Escrow ID creation.png" alt="Escrow 9 created for Marketing project, 200 XLM" width="100%"/>

> *Escrow #9 created on-chain for a "Marketing" project. 200 XLM locked. Full release and refund controls visible.*

---

## ✨ Features at a Glance

| Feature | What it does |
| :------ | :----------- |
| 🔒 Trustless escrow | XLM locked in contract state — no hot wallet, no company custody |
| 👛 Freighter wallet | Connect, view balance, sign transactions — all in the browser |
| ✏️ Memo support | Optional project description stored on-chain with every escrow |
| 🆔 Escrow IDs | Every escrow gets an incrementing ID — look up any escrow from chain |
| ✅ Release funds | Client approves work → XLM goes to freelancer instantly |
| ↩️ Refund | Client cancels → XLM returns to client wallet instantly |
| ⏳ Loading states | Animated 5-step progress overlay tracks every transaction |
| 💾 Balance cache | 30-second TTL cache — no unnecessary Soroban RPC calls |
| 📡 Contract events | `created` `released` `refunded` events queryable on Stellar Expert |
| 📱 Mobile responsive | Works on every screen size — hamburger nav and fluid grids |
| 🔁 CI/CD | GitHub Actions runs frontend build and contract tests on every push |
| 🧪 9 unit tests | Every function, error code, and edge case covered |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                  User's Browser                  │
│                                                  │
│   React 19  ·  TypeScript 5.8  ·  Tailwind 4.1  │
│   Vite 6  ·  Framer Motion 11                    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│              Freighter Extension                 │
│                                                  │
│   Builds transactions  ·  Signs locally          │
│   Private key never leaves the device            │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│          @stellar/stellar-sdk  v14               │
│                                                  │
│   Constructs XDR  ·  Simulates  ·  Submits       │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│          Soroban RPC  ·  Stellar Testnet          │
│   soroban-testnet.stellar.org                    │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│           Soroban Smart Contract                 │
│                                                  │
│   Rust  ·  Soroban SDK 21.7.7                    │
│   CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37...PT7  │
└──────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```text
stellarfund/
│
├── .github/
│   └── workflows/
│       └── ci.yml                  GitHub Actions — 2 parallel jobs
│
├── assets/                         Screenshots used in this README
│
├── contracts/
│   └── stellar_fund/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs              Soroban contract + 9 unit tests
│
├── src/
│   ├── components/
│   │   ├── StellarLogo.tsx         Custom SVG logo
│   │   └── UI.tsx                  Button, Card, Input, Badge, Toast, LoadingOverlay
│   │
│   ├── hooks/
│   │   ├── useWallet.ts            Freighter connection + 30s balance cache
│   │   └── useToast.ts             Toast notification queue
│   │
│   ├── lib/
│   │   └── stellar.ts              All blockchain logic — SDK v14 + Freighter v6
│   │
│   ├── pages/
│   │   ├── Home.tsx                Animated landing page
│   │   └── App.tsx                 Dashboard — create, view, release, refund
│   │
│   ├── types/
│   │   └── index.ts                Shared TypeScript interfaces
│   │
│   ├── main.tsx
│   └── index.css                   Tailwind v4 + keyframe animations
│
├── Cargo.toml                      Rust workspace
├── package.json
├── vite.config.ts
├── tsconfig.json                   Strict mode enabled
├── vercel.json                     SPA rewrite rules
└── .env.example
```

---

## 📜 Smart Contract API

### Contract Address

```
CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7
```

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7)

### Functions

| Function | Parameters | Returns | Auth |
| :------- | :--------- | :------ | :--: |
| `create_escrow` | `client, freelancer, amount: i128, memo: String` | `Result<u32, Error>` | client |
| `release` | `client: Address, id: u32` | `Result<(), Error>` | client |
| `refund` | `client: Address, id: u32` | `Result<(), Error>` | client |
| `get_escrow` | `id: u32` | `Result<Escrow, Error>` | — |
| `get_counter` | — | `u32` | — |

### Error Codes

| Code | Name | Meaning |
| :--: | :--- | :------ |
| `#1` | `EscrowNotFound` | No escrow exists with that ID |
| `#2` | `UnauthorizedClient` | Caller is not the original client wallet |
| `#3` | `AlreadyCompleted` | Escrow already released or refunded |

### Escrow Struct

```rust
pub struct Escrow {
    pub id:         u32,
    pub client:     Address,
    pub freelancer: Address,
    pub amount:     i128,          // 1 XLM = 10,000,000 stroops
    pub status:     EscrowStatus,  // Active | Released | Refunded
    pub created_at: u64,
    pub memo:       String,
}
```

### Contract Events

```rust
// Emitted on every state change — queryable from Stellar Expert RPC
env.events().publish(("created",  id), amount);
env.events().publish(("released", id), amount);
env.events().publish(("refunded", id), amount);
```

### CLI

```bash
# Create a 200 XLM escrow
stellar contract invoke \
  --id CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7 \
  --source my-account --network testnet \
  -- create_escrow \
  --client  GALWWEGHOMU5YODTZBVGPFP2OHCJH5VO3VKWNMW7ZNT6OECINVPQT7SQ \
  --freelancer GAMZFU5HFWQRSVTHYCRGVDHRFAQKSVIMU232D3LITOEIDVD6MZVXVOHC \
  --amount 2000000000 \
  --memo "Marketing project"

# Release — pays the freelancer
stellar contract invoke ... -- release \
  --client GALW...T7SQ --id 9

# Refund — returns XLM to client
stellar contract invoke ... -- refund \
  --client GALW...T7SQ --id 9
```

---

## 🧪 Test Results

All smart contract functionalities have been thoroughly tested and validated.

### ✅ Test Summary
- Total Tests: 9
- Passed: 9
- Failed: 0
- Status: ✔️ All tests passing

### 🔍 Key Test Cases Covered
- ✔️ Escrow creation
- ✔️ Release payment functionality
- ✔️ Refund functionality
- ✔️ Prevent double release
- ✔️ Prevent refund after release
- ✔️ Validate invalid escrow amounts
- ✔️ Authorization checks (only the original client can act)
- ✔️ Event emission on release/refund

### 📸 Test Execution Proof

Below is the actual test output from the smart contract:

![Test Results](./Screenshots/test-results.png)

## CI/CD Pipeline

The project uses GitHub Actions to validate the frontend and Soroban contracts on every push and pull request to `main`.

```text
Push or pull request to main
    │
    ├── job: frontend
    │     ├── setup Node.js
    │     ├── install dependencies
    │     ├── lint
    │     ├── test
    │     ├── production build
    │     └── upload frontend artifact
    │
    ├── job: contracts
    │     ├── setup Rust + wasm target
    │     ├── run contract tests
    │     ├── build release WASM binaries
    │     └── upload contract artifacts
    │
    └── job: deploy
          ├── waits for all checks to pass
          ├── runs on `main`
          └── deploys to Vercel when secrets are available


Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## 🚀 Quick Start

### Prerequisites

| Tool | Install |
| :--- | :------ |
| Node.js ≥ 20 | [nodejs.org](https://nodejs.org) |
| Rust stable | [rustup.rs](https://rustup.rs) |
| wasm32v1-none target | `rustup target add wasm32v1-none` |
| Stellar CLI | `cargo install --locked stellar-cli --features opt` |
| Freighter extension | [freighter.app](https://freighter.app) |

### Run locally

```bash
# Clone
git clone https://github.com/vaibhavi-0320/stellarfund
cd stellarfund

# Install
npm install

# Configure (contract ID already set)
cp .env.example .env.local

# Start
npm run dev
# → http://localhost:3000
```

### Get free testnet XLM

Go to [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test), paste your `G...` wallet address, click **Create Account** — 10,000 XLM arrives instantly.

### Run contract tests

```bash
cargo test -p stellar-fund-contract
# Expected: 9 passed, 0 failed
```

---

## 🚢 Deployment

### Smart contract

```bash
# Fund a deploy keypair
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Build
cargo build -p stellar-fund-contract --target wasm32v1-none --release

# Deploy
stellar contract deploy \
  --wasm target/wasm32v1-none/release/stellar_fund_contract.wasm \
  --source-account deployer \
  --network testnet
# → Copy the C... address to .env.local as VITE_STELLAR_CONTRACT_ID
```

### Frontend

```bash
npm run build
vercel --prod
# Add VITE_STELLAR_CONTRACT_ID in the Vercel dashboard environment variables
```

---

## 🐛 Four Bugs Fixed Along the Way

### 1 — Escrow ID showed as "unavailable"

**Problem:** `stellar-sdk` v14 `ScVal` return value decoding returns `null` silently for some deployments.

**Fix:** After confirmation, call `get_counter()` via simulation — the counter always equals the last created escrow ID.

```typescript
let escrowId = safeU32(returnValue);
if (escrowId === null) escrowId = await fetchCounter();
```

### 2 — Freighter returned an object, not a string

**Problem:** freighter-api v6 changed `signTransaction()` to return `{ signedTxXdr: string }`. Passing the object to `fromXDR()` caused "Bad union switch: 4".

**Fix:**

```typescript
const signedXdr =
  typeof raw === 'string' ? raw :
  (raw as { signedTxXdr?: string })?.signedTxXdr ?? '';
```

### 3 — XDR crash on non-integer escrow ID

**Problem:** Pasting a transaction hash into the escrow ID field — `parseInt("a83875...")` returns `NaN` — crashed XDR serialisation before the RPC call.

**Fix:** `parseEscrowId()` checks for wallet addresses, tx hashes, and non-integers before any XDR is built.

### 4 — "UnauthorizedClient" confused users

**Problem:** `require_auth(client)` is correct Rust behaviour — only the creating wallet can act. But the raw error code `#2` was shown directly.

**Fix:** Error `#2` is caught and shown in plain English. The connected wallet is displayed as **CLIENT (YOU)** during creation.

---

## 📝 Commit History

```text
feat: project scaffold — React 19, TypeScript, Tailwind v4, Vite 6
feat: Soroban contract — create_escrow, release, refund, get_escrow, get_counter
test: 9 unit tests — all functions, error codes, edge cases
feat: stellar.ts — freighter-api v6 + stellar-sdk v14 compatibility
fix: escrow ID via get_counter() fallback after returnValue decode failure
feat: animated home — starfield, orbit intro, Framer Motion, FAQ accordion
feat: dashboard — escrow list, release, refund, transaction history
feat: mobile responsive — hamburger nav, clamp() typography, CSS grid
feat: GitHub Actions CI/CD — frontend and contract on every push to main
```

---

## 🔗 Links

| | Link |
|:-|:-----|
| 🔴 Live App | [steller-fund.vercel.app](https://steller-fund.vercel.app/) |
| 🎬 Demo Video | [loom.com/share/d2e7203f...](https://www.loom.com/share/d2e7203f65a243299b0634f6e6d558ec) |
| 📜 Contract | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7) |
| 💧 Free XLM | [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test) |
| 👛 Freighter | [freighter.app](https://freighter.app) |
| 📚 Soroban Docs | [soroban.stellar.org](https://soroban.stellar.org/docs) |
| 📚 Stellar Docs | [developers.stellar.org](https://developers.stellar.org) |

---

<div align="center">

<br/>

*Built for the Stellar Journey to Mastery program, Orange Belt + Green Belt*

[![Stellar](https://img.shields.io/badge/Built_on-Stellar-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)

**[⬆ Back to Top](#the-escrow-is-the-code-the-code-is-the-law)**

<br/>

</div>
