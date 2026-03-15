# Smart Contract

Soroban escrow contract crate for StellarFund.

This README is scoped to the Rust contract in `contracts/hello_world`. For repo-level setup and web app usage, use the root `README.md`.

## Contract Surface

| Method | Purpose |
| --- | --- |
| `create_escrow` | Lock funds in contract storage and create an active escrow |
| `release_payment` | Transfer locked funds to the freelancer |
| `refund` | Return locked funds to the client |
| `get_escrow` | Read escrow state by id |
| `get_next_escrow_id` | Read the next id that will be assigned |

## Crate Metadata

| Item | Value |
| --- | --- |
| Cargo package | `stellar-fund-contract` |
| Crate path | `contracts/hello_world` |
| Output WASM | `stellar_fund_contract.wasm` |

## Development Commands

```bash
cargo test -p stellar-fund-contract
cargo build --target wasm32-unknown-unknown --release
```

## Source Layout

```text
contracts/hello_world
|- src/lib.rs              Contract implementation
|- src/test.rs             Contract unit tests
|- Cargo.toml              Crate manifest
`- README.md
```

## Notes

- Contract tests live in `src/test.rs`.
- The web client calls this crate through Soroban RPC from `apps/web/src/lib/soroban.ts`.
