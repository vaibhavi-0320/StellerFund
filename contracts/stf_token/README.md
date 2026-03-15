# STF Token Contract

Custom Soroban token contract for the StellarFund platform.

## Token Metadata

| Field | Value |
| --- | --- |
| Name | `StellarFund Token` |
| Symbol | `STF` |
| Decimals | `7` |

## Supported Functions

| Method | Purpose |
| --- | --- |
| `initialize` | Sets admin, name, symbol, and decimals |
| `mint` | Mints STF for testnet/demo workflows |
| `transfer` | Moves STF between addresses and contracts |
| `balance` | Reads balance for an address |
| `name` | Returns token name |
| `symbol` | Returns token symbol |
| `decimals` | Returns token decimals |
| `admin` | Returns the current admin |

## Notes

- `mint` is intentionally available for testnet and local testing.
- `transfer` supports inter-contract calls, which lets the escrow contract reward freelancers in STF on release.
- Events are published for both `mint` and `transfer` to support indexing and observability.
