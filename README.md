# StellarFund - Decentralized Freelance Escrow

A smart contract-based escrow system for freelancers and clients on the Stellar blockchain.

## Project Overview

StellarFund solves the trust problem in freelance work by using smart contracts to hold funds in escrow until work is completed.

**How it works:**
1. Client creates escrow and locks XLM
2. Freelancer completes the work
3. Client releases funds via smart contract
4. Funds automatically transferred to the freelancer

## Folder Structure

```
stellar-fund/
├── contracts/
│   └── stellar_fund/
│       ├── src/
│       │   ├── lib.rs          # Main contract code
│       │   └── test.rs         # Unit tests
│       └── Cargo.toml          # Rust dependencies
├── frontend/
│   ├── index.html              # Main UI
│   ├── main.js                 # Contract interaction
│   └── style.css               # Styling
└── README.md
```

## Prerequisites

- Rust installed
- Stellar CLI installed
- Soroban SDK installed
- Funded Stellar testnet account
- Freighter wallet extension

## Build Contract

```bash
cd contracts/stellar_fund
stellar contract build
```

**What this does:**
Compiles the Rust contract to WASM bytecode

Output: `target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm`

## Deploy Contract

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

**What this does:**
- Uploads contract to Stellar testnet
- Returns contract ID (save this!)

**Example output:**
```
Contract deployed successfully!
Contract ID: CBGTGZKQCGQ5QVNMYQZWNKWGZQDL4L4QNXHF7MMHF3MZJMVT7SQA
```

## Update Frontend

Open `frontend/main.js` and replace:
```javascript
const CONTRACT_ID = 'YOUR_CONTRACT_ID_HERE';
```

With your deployed contract ID.

## Test Contract (CLI)

### Create Escrow
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_SECRET> \
  --network testnet \
  -- \
  create_escrow \
  --client <CLIENT_ADDRESS> \
  --freelancer <FREELANCER_ADDRESS> \
  --amount 10000000
```

**What this does:**
Creates new escrow with 1 XLM (10000000 stroops)

### Release Escrow
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <CLIENT_SECRET> \
  --network testnet \
  -- \
  release_escrow \
  --client <CLIENT_ADDRESS> \
  --id 1
```

**What this does:**
Releases funds from escrow ID 1 to freelancer

### Get Escrow Details
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <ANY_SECRET> \
  --network testnet \
  -- \
  get_escrow \
  --id 1
```

**What this does:**
Retrieves escrow information

## Create Testnet Account

```bash
stellar keys generate --network testnet --name my-account
```

**What this does:**
Generates new keypair for testnet

**Fund account:**
```bash
stellar keys fund my-account --network testnet
```

Or visit: https://laboratory.stellar.org/#account-creator?network=test

## Smart Contract Logic

### Data Structures

**Escrow struct:**
```rust
pub struct Escrow {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub released: bool,
}
```

### Error Types

```rust
pub enum Error {
    EscrowNotFound = 1,    // Escrow ID doesn't exist
    NotAuthorized = 2,      // Not the client
    AlreadyReleased = 3,    // Funds already released
    InvalidAmount = 4,      // Amount <= 0
}
```

### Functions

**create_escrow(client, freelancer, amount)**
- Validates amount > 0
- Increments counter
- Stores escrow in contract storage
- Returns escrow ID

**release_escrow(client, id)**
- Verifies client authorization
- Checks escrow exists
- Marks as released
- Transfers funds to freelancer

**get_escrow(id)**
- Fetches escrow details
- Returns Escrow struct

## Storage System

Stellar uses key-value storage:

```
COUNTER → u64                    // Escrow counter
1 → Escrow { id: 1, ... }        // Escrow data
2 → Escrow { id: 2, ... }
```

**How it works:**
- Counter tracks total escrows
- Each escrow stored by ID
- Permanent on-chain storage

## Frontend Usage

1. Open `frontend/index.html` in browser
2. Click "Connect Wallet"
3. Approve in Freighter
4. Create escrow with freelancer address
5. Release funds when work complete

## Testing Locally

Serve frontend:
```bash
cd frontend
python3 -m http.server 8000
```

Open: http://localhost:8000

## Yellow Belt Checklist

- ✅ Deploy on Stellar Testnet
- ✅ 4 error types handled
- ✅ Frontend contract calls
- ✅ Transaction status display
- ✅ Clean folder structure
- ✅ CLI commands provided
- ✅ Soroban SDK patterns
- ✅ Production-ready code



## Learn More

- [Stellar Docs](https://developers.stellar.org)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Freighter Wallet](https://freighter.app)
