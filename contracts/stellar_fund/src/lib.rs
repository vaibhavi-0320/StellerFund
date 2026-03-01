#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env, Symbol};

const COUNTER: Symbol = Symbol::short("COUNTER");

#[derive(Clone)]
#[contracttype]
pub enum EscrowStatus {
    Active,
    Completed,
    Cancelled,
}

#[derive(Clone)]
#[contracttype]
pub struct Escrow {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub amount: i128,
    pub status: EscrowStatus,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    EscrowNotFound = 1,
    NotAuthorized = 2,
    AlreadyCompleted = 3,
    InvalidAmount = 4,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        amount: i128,
    ) -> Result<u64, Error> {
        client.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut counter: u64 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        counter += 1;

        let escrow = Escrow {
            id: counter,
            client: client.clone(),
            freelancer: freelancer.clone(),
            amount,
            status: EscrowStatus::Active,
        };

        env.storage().instance().set(&counter, &escrow);
        env.storage().instance().set(&COUNTER, &counter);

        Ok(counter)
    }

    pub fn release_payment(env: Env, client: Address, id: u64) -> Result<(), Error> {
        client.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&id)
            .ok_or(Error::EscrowNotFound)?;

        if escrow.client != client {
            return Err(Error::NotAuthorized);
        }

        if matches!(escrow.status, EscrowStatus::Completed | EscrowStatus::Cancelled) {
            return Err(Error::AlreadyCompleted);
        }

        escrow.status = EscrowStatus::Completed;
        env.storage().instance().set(&id, &escrow);

        Ok(())
    }

    pub fn refund(env: Env, client: Address, id: u64) -> Result<(), Error> {
        client.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&id)
            .ok_or(Error::EscrowNotFound)?;

        if escrow.client != client {
            return Err(Error::NotAuthorized);
        }

        if matches!(escrow.status, EscrowStatus::Completed | EscrowStatus::Cancelled) {
            return Err(Error::AlreadyCompleted);
        }

        escrow.status = EscrowStatus::Cancelled;
        env.storage().instance().set(&id, &escrow);

        Ok(())
    }

    pub fn get_escrow(env: Env, id: u64) -> Result<Escrow, Error> {
        env.storage()
            .instance()
            .get(&id)
            .ok_or(Error::EscrowNotFound)
    }
}
