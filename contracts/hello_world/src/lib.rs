#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env};

const TTL_THRESHOLD: u32 = 1_000;
const TTL_BUMP: u32 = 5_000;

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
#[derive(Clone)]
enum DataKey {
    NextEscrowId,
    Escrow(u64),
}

#[contract]
pub struct StellarFundContract;

#[contractimpl]
impl StellarFundContract {
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        amount: i128,
    ) -> u64 {
        client.require_auth();

        if amount <= 0 {
            panic!("Amount must be greater than zero");
        }

        if client == freelancer {
            panic!("Client and freelancer must be different addresses");
        }

        let escrow_id = Self::get_next_escrow_id(env.clone());
        let contract_address = env.current_contract_address();

        token::TokenClient::new(&env, &token).transfer(&client, &contract_address, &amount);

        let escrow = Escrow {
            id: escrow_id,
            client: client.clone(),
            freelancer: freelancer.clone(),
            token: token.clone(),
            amount,
            status: Status::Active,
        };

        let escrow_key = DataKey::Escrow(escrow_id);
        env.storage().persistent().set(&escrow_key, &escrow);
        Self::bump_persistent(&env, &escrow_key);

        let next_escrow_id = escrow_id.checked_add(1).expect("Escrow ID overflow");
        env.storage()
            .persistent()
            .set(&DataKey::NextEscrowId, &next_escrow_id);
        Self::bump_persistent(&env, &DataKey::NextEscrowId);

        env.events().publish(
            (symbol_short!("create"), escrow_id, client, freelancer),
            amount,
        );

        escrow_id
    }

    pub fn release_payment(env: Env, escrow_id: u64, client: Address) {
        client.require_auth();

        let mut escrow = Self::load_escrow(&env, escrow_id);
        Self::assert_client(&escrow, &client);
        Self::assert_active(&escrow);

        let contract_address = env.current_contract_address();
        token::TokenClient::new(&env, &escrow.token).transfer(
            &contract_address,
            &escrow.freelancer,
            &escrow.amount,
        );

        escrow.status = Status::Completed;
        Self::save_escrow(&env, &escrow);
        env.events().publish(
            (symbol_short!("release"), escrow_id, client, escrow.freelancer),
            escrow.amount,
        );
    }

    pub fn refund(env: Env, escrow_id: u64, client: Address) {
        client.require_auth();

        let mut escrow = Self::load_escrow(&env, escrow_id);
        Self::assert_client(&escrow, &client);
        Self::assert_active(&escrow);

        let contract_address = env.current_contract_address();
        token::TokenClient::new(&env, &escrow.token).transfer(
            &contract_address,
            &escrow.client,
            &escrow.amount,
        );

        escrow.status = Status::Cancelled;
        Self::save_escrow(&env, &escrow);
        env.events()
            .publish((symbol_short!("refund"), escrow_id, client), escrow.amount);
    }

    pub fn get_escrow(env: Env, escrow_id: u64) -> Escrow {
        Self::load_escrow(&env, escrow_id)
    }

    pub fn get_next_escrow_id(env: Env) -> u64 {
        let next_key = DataKey::NextEscrowId;
        let next_id = if env.storage().persistent().has(&next_key) {
            env.storage()
                .persistent()
                .get(&next_key)
                .expect("Next escrow id not found")
        } else {
            1_u64
        };
        if env.storage().persistent().has(&next_key) {
            Self::bump_persistent(&env, &next_key);
        }
        next_id
    }

    fn load_escrow(env: &Env, escrow_id: u64) -> Escrow {
        let key = DataKey::Escrow(escrow_id);
        let escrow = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Escrow not found");
        Self::bump_persistent(env, &key);
        escrow
    }

    fn save_escrow(env: &Env, escrow: &Escrow) {
        let key = DataKey::Escrow(escrow.id);
        env.storage().persistent().set(&key, escrow);
        Self::bump_persistent(env, &key);
    }

    fn bump_persistent(env: &Env, key: &DataKey) {
        env.storage()
            .persistent()
            .extend_ttl(key, TTL_THRESHOLD, TTL_BUMP);
    }

    fn assert_client(escrow: &Escrow, client: &Address) {
        if &escrow.client != client {
            panic!("Unauthorized: only the client can perform this action");
        }
    }

    fn assert_active(escrow: &Escrow) {
        if escrow.status != Status::Active {
            panic!("Escrow is not active");
        }
    }
}

#[cfg(test)]
mod test;
