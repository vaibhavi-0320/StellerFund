# CLI Commands Reference

## Account Management

### Generate new account
```bash
stellar keys generate --network testnet --name my-account
```
Creates new testnet keypair

### Fund account
```bash
stellar keys fund my-account --network testnet
```
Adds 10,000 XLM testnet funds

### Get address
```bash
stellar keys address my-account
```
Shows public key

### Get balance
```bash
stellar account balance my-account --network testnet
```
Shows account XLM balance

## Contract Build

### Build contract
```bash
cd contracts/stellar_fund
stellar contract build
```
Compiles Rust to WASM

### Optimize build
```bash
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm
```
Reduces WASM file size

## Contract Deployment

### Deploy
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
  --source my-account \
  --network testnet
```
Deploys to testnet, returns contract ID

### Install (advanced)
```bash
stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
  --source my-account \
  --network testnet
```
Installs WASM code

## Contract Invocation

### Create escrow
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source my-account \
  --network testnet \
  -- \
  create_escrow \
  --client GALW...T7SQ \
  --freelancer GAMZ...D6M \
  --amount 10000000
```

### Release escrow
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source my-account \
  --network testnet \
  -- \
  release_escrow \
  --client GALW...T7SQ \
  --id 1
```

### Refund escrow
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source my-account \
  --network testnet \
  -- \
  refund_escrow \
  --client GALW...T7SQ \
  --id 1
```

### Get escrow
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source my-account \
  --network testnet \
  -- \
  get_escrow \
  --id 1
```

### Get counter
```bash
stellar contract invoke \
  --id CONTRACT_ID \
  --source my-account \
  --network testnet \
  -- \
  get_counter
```

## Testing

### Run tests
```bash
cd contracts/stellar_fund
cargo test
```

### Run specific test
```bash
cargo test test_create_escrow
```

### Test with output
```bash
cargo test -- --nocapture
```

## Useful Commands

### View transaction
```bash
stellar transaction view TX_HASH --network testnet
```

### List accounts
```bash
stellar keys list
```

### Switch network
```bash
stellar network add --rpc-url https://soroban-testnet.stellar.org
```

## Environment Setup

### Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Install Stellar CLI
```bash
cargo install --locked stellar-cli
```

### Add WASM target
```bash
rustup target add wasm32-unknown-unknown
```

### Update CLI
```bash
cargo install --locked stellar-cli --force
```
