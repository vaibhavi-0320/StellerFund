# Smart Contract

Soroban escrow contract for StellarFund.

## Exposed Methods

| Method | Purpose |
| --- | --- |
| `create_escrow` | Lock funds in contract storage and create an active escrow |
| `release_payment` | Transfer locked funds to the freelancer |
| `refund` | Return locked funds to the client |
| `get_escrow` | Read escrow state by id |
| `get_next_escrow_id` | Read the next id that will be assigned |

## Local Commands

```bash
cargo test
cargo build --target wasm32-unknown-unknown --release
```

## Crate Metadata

| Item | Value |
| --- | --- |
| Cargo package | `stellar-fund-contract` |
| Output WASM | `stellar_fund_contract.wasm` |

## Source Layout

```text
contracts/hello_world
|- src/lib.rs              Contract implementation
|- src/test.rs             Unit tests
|- Cargo.toml              Contract crate manifest
`- README.md
```
