// ============================================================
// StellarFund Configuration
// ============================================================
// IMPORTANT: Replace CONTRACT_ID with your deployed Soroban contract ID
// Deploy your contract first, then paste the ID here.
//
// To deploy:
//   cd contracts/hello_world
//   cargo build --target wasm32-unknown-unknown --release
//   soroban contract deploy \
//     --wasm target/wasm32-unknown-unknown/release/stellar_fund_contract.wasm \
//     --source <YOUR_SECRET_KEY> \
//     --network testnet
//
// The command will output your contract ID (starts with C...)
// ============================================================

export const CONTRACT_ID = 'CBB3RJXMYQNHXQTRRZULUJMARRNZJHM4XUQN37LBG54ABYS7TE2EJPT7';
export const NATIVE_ASSET_CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
export const FRIENDBOT_URL = 'https://friendbot.stellar.org';
