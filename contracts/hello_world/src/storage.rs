use soroban_sdk::{contracttype, Address, Env};

const INSTANCE_TTL_THRESHOLD: u32 = 1_000;
const INSTANCE_TTL_BUMP: u32 = 10_000;
const PERSISTENT_TTL_THRESHOLD: u32 = 1_000;
const PERSISTENT_TTL_BUMP: u32 = 10_000;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Status {
    Active,
    Completed,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Escrow {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub token: Address,
    pub amount: i128,
    pub status: Status,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Config {
    pub admin: Address,
    pub reward_token: Address,
    pub release_reward_amount: i128,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Config,
    NextEscrowId,
    Escrow(u64),
}

pub fn next_escrow_id(env: &Env) -> u64 {
    let key = DataKey::NextEscrowId;
    let current = env.storage().persistent().get(&key).unwrap_or(1_u64);
    env.storage().persistent().set(&key, &(current + 1));
    bump_persistent(env, &key);
    current
}

pub fn load_escrow(env: &Env, escrow_id: u64) -> Option<Escrow> {
    let key = DataKey::Escrow(escrow_id);
    let escrow = env.storage().persistent().get(&key);
    if escrow.is_some() {
        bump_persistent(env, &key);
    }
    escrow
}

pub fn save_escrow(env: &Env, escrow: &Escrow) {
    let key = DataKey::Escrow(escrow.id);
    env.storage().persistent().set(&key, escrow);
    bump_persistent(env, &key);
}

pub fn load_config(env: &Env) -> Option<Config> {
    let key = DataKey::Config;
    let config = env.storage().instance().get(&key);
    if config.is_some() {
        bump_instance(env);
    }
    config
}

pub fn save_config(env: &Env, config: &Config) {
    let key = DataKey::Config;
    env.storage().instance().set(&key, config);
    bump_instance(env);
}

pub fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_TTL_THRESHOLD, INSTANCE_TTL_BUMP);
}

pub fn bump_persistent(env: &Env, key: &DataKey) {
    env.storage()
        .persistent()
        .extend_ttl(key, PERSISTENT_TTL_THRESHOLD, PERSISTENT_TTL_BUMP);
}
