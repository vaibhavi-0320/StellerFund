# Deployment Guide

## Step-by-Step Deployment

### 1. Build Contract

```bash
cd contracts/stellar_fund
stellar contract build
```

Expected output:
```
Compiling stellar-fund-contract v0.1.0
Finished release [optimized] target(s)
```

### 2. Deploy to Testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
  --source alice \
  --network testnet
```

Replace `alice` with your account name.

Expected output:
```
Contract deployed successfully!
CBGTGZKQCGQ5QVNMYQZWNKWGZQDL4L4QNXHF7MMHF3MZJMVT7SQA
```

**Save this contract ID!**

### 3. Update Frontend

Edit `frontend/main.js`:

```javascript
const CONTRACT_ID = 'CBGTGZKQCGQ5QVNMYQZWNKWGZQDL4L4QNXHF7MMHF3MZJMVT7SQA';
```

### 4. Test Contract

Create test escrow:
```bash
stellar contract invoke \
  --id CBGTGZKQCGQ5QVNMYQZWNKWGZQDL4L4QNXHF7MMHF3MZJMVT7SQA \
  --source alice \
  --network testnet \
  -- \
  create_escrow \
  --client GALW...T7SQ \
  --freelancer GAMZ...D6M \
  --amount 10000000
```

Expected output:
```
1
```

This is your escrow ID.

### 5. Run Frontend

```bash
cd frontend
python3 -m http.server 8000
```

Open: http://localhost:8000

### 6. Connect Wallet

1. Install Freighter extension
2. Switch to TESTNET
3. Click "Connect Wallet"
4. Approve connection

### 7. Create Escrow

1. Enter freelancer address
2. Enter amount in XLM
3. Click "Create Escrow"
4. Approve in Freighter
5. Wait for confirmation

### 8. Release Funds

1. Enter escrow ID
2. Click "Release Funds"
3. Approve in Freighter
4. Funds transferred!

## Troubleshooting

### Contract build fails

```bash
rustup target add wasm32-unknown-unknown
```

### Deploy fails

Check account balance:
```bash
stellar keys address alice
stellar account balance --network testnet
```

Fund if needed:
```bash
stellar keys fund alice --network testnet
```

### Frontend errors

Check browser console (F12)

Common fixes:
- Update CONTRACT_ID
- Connect wallet
- Switch to testnet
