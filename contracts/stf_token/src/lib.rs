#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String,
};

const INSTANCE_TTL_THRESHOLD: u32 = 1_000;
const INSTANCE_TTL_BUMP: u32 = 10_000;
const PERSISTENT_TTL_THRESHOLD: u32 = 1_000;
const PERSISTENT_TTL_BUMP: u32 = 10_000;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum TokenError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InvalidAmount = 4,
    BalanceTooLow = 5,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Admin,
    Name,
    Symbol,
    Decimals,
    Balance(Address),
}

pub struct TransferEvent {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

pub struct MintEvent {
    pub to: Address,
    pub amount: i128,
}

impl TransferEvent {
    fn publish(self, env: &Env) {
        env.events()
            .publish((symbol_short!("transfer"), self.from, self.to), self.amount);
    }
}

impl MintEvent {
    fn publish(self, env: &Env) {
        env.events().publish((symbol_short!("mint"), self.to), self.amount);
    }
}

#[contract]
pub struct StfTokenContract;

#[contractimpl]
impl StfTokenContract {
    pub fn initialize(
        env: Env,
        admin: Address,
        name: String,
        symbol: String,
        decimals: u32,
    ) -> Result<(), TokenError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(TokenError::AlreadyInitialized);
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::Decimals, &decimals);
        bump_instance(&env);
        Ok(())
    }

    pub fn mint(env: Env, to: Address, amount: i128) -> Result<(), TokenError> {
        if amount <= 0 {
            return Err(TokenError::InvalidAmount);
        }

        let admin = get_admin(&env)?;
        admin.require_auth();

        let next_balance = balance_of(&env, &to) + amount;
        set_balance(&env, &to, next_balance);

        MintEvent { to, amount }.publish(&env);
        Ok(())
    }

    // Allows direct account auth or contract-self spends for inter-contract rewards.
    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        amount: i128,
    ) -> Result<(), TokenError> {
        if amount <= 0 {
            return Err(TokenError::InvalidAmount);
        }

        // Requiring auth on `from` supports both wallet-initiated transfers and
        // contract-to-contract calls where the sending contract authorizes itself.
        from.require_auth();

        let from_balance = balance_of(&env, &from);
        if from_balance < amount {
            return Err(TokenError::BalanceTooLow);
        }

        set_balance(&env, &from, from_balance - amount);
        set_balance(&env, &to, balance_of(&env, &to) + amount);

        TransferEvent { from, to, amount }.publish(&env);
        Ok(())
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        balance_of(&env, &id)
    }

    pub fn name(env: Env) -> Result<String, TokenError> {
        get_value(&env, &DataKey::Name)
    }

    pub fn symbol(env: Env) -> Result<String, TokenError> {
        get_value(&env, &DataKey::Symbol)
    }

    pub fn decimals(env: Env) -> Result<u32, TokenError> {
        get_value(&env, &DataKey::Decimals)
    }

    pub fn admin(env: Env) -> Result<Address, TokenError> {
        get_admin(&env)
    }
}

fn get_admin(env: &Env) -> Result<Address, TokenError> {
    get_value(env, &DataKey::Admin)
}

fn get_value<T>(env: &Env, key: &DataKey) -> Result<T, TokenError>
where
    T: soroban_sdk::TryFromVal<Env, soroban_sdk::Val>,
{
    let value = env.storage().instance().get(key).ok_or(TokenError::NotInitialized)?;
    bump_instance(env);
    Ok(value)
}

fn balance_of(env: &Env, id: &Address) -> i128 {
    let key = DataKey::Balance(id.clone());
    if let Some(balance) = env.storage().persistent().get(&key) {
        bump_persistent(env, &key);
        balance
    } else {
        0_i128
    }
}

fn set_balance(env: &Env, id: &Address, amount: i128) {
    let key = DataKey::Balance(id.clone());
    env.storage().persistent().set(&key, &amount);
    bump_persistent(env, &key);
}

fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_TTL_THRESHOLD, INSTANCE_TTL_BUMP);
}

fn bump_persistent(env: &Env, key: &DataKey) {
    env.storage()
        .persistent()
        .extend_ttl(key, PERSISTENT_TTL_THRESHOLD, PERSISTENT_TTL_BUMP);
}

#[cfg(test)]
mod test {
    extern crate std;

    use super::*;
    use soroban_sdk::testutils::{Address as _, EnvTestConfig};

    #[test]
    fn test_token_mint_and_transfer() {
        let env = Env::new_with_config(EnvTestConfig {
            capture_snapshot_at_drop: false,
        });
        env.mock_all_auths_allowing_non_root_auth();

        let admin = Address::generate(&env);
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);
        let contract_id = env.register_contract(None, StfTokenContract);
        let client = StfTokenContractClient::new(&env, &contract_id);

        client.initialize(
            &admin,
            &String::from_str(&env, "StellarFund Token"),
            &String::from_str(&env, "STF"),
            &7_u32,
        );
        client.mint(&alice, &1_000);
        client.transfer(&alice, &bob, &250);

        assert_eq!(client.balance(&alice), 750);
        assert_eq!(client.balance(&bob), 250);
        assert_eq!(client.decimals(), 7);
        assert_eq!(client.symbol(), String::from_str(&env, "STF"));
    }
}
